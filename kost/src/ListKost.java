

import javax.swing.*;
import javax.swing.table.DefaultTableModel;

import org.json.JSONArray;
import org.json.JSONObject;

import java.awt.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class ListKost extends JFrame {
    private JTable table;
    private JScrollPane scrollPane;

    public ListKost() {
        setTitle("List Kost");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(600, 300);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        JPanel buttonPanel = new JPanel();

        // Create the table model
        DefaultTableModel tableModel = new DefaultTableModel();
        tableModel.addColumn("ID Kost");
        tableModel.addColumn("Nama Kost");
        tableModel.addColumn("Alamat Kost");
        tableModel.addColumn("Fasilitas Kost");
        tableModel.addColumn("Harga Kost");
        tableModel.addColumn("Kamar Tersedia");

        JButton backButton = new JButton("Kembali");
        buttonPanel.add(backButton);
        add(buttonPanel, BorderLayout.SOUTH);

        backButton.addActionListener(e -> {
            dispose();
        });

        try {
            URL url = new URL("http://localhost:7000/listkost");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder responseBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    responseBuilder.append(line);
                }
                String response = responseBuilder.toString();
                System.out.println("Server Response: " + response);

                // Parse the JSON response
                JSONObject jsonObject = new JSONObject(response);
                JSONArray dataArray = jsonObject.getJSONArray("response");
                for (int i = 0; i < dataArray.length(); i++) {
                    JSONObject kost = dataArray.getJSONObject(i);
                    int id = kost.getInt("idkost");
                    String namakost = kost.getString("namakost");
                    String alamat = kost.getString("alamat");
                    String fasilitas = kost.getString("fasilitas");
                    String harga = kost.getString("harga");
                    String stok = kost.getString("kamarkosong");

                    // Add the data to the table model
                    tableModel.addRow(new Object[]{id, namakost, alamat, fasilitas, harga, stok});
                }
            } else {
                System.out.println("Failed to connect to the server. Response code: " + responseCode);
            }

            connection.disconnect();
        } catch (Exception ex) {
            System.out.println("Error occurred while connecting to the server.");
            ex.printStackTrace();
        }

        table = new JTable(tableModel);
        scrollPane = new JScrollPane(table);
        
        add(scrollPane, BorderLayout.CENTER);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new ListKost().setVisible(true);
            }
        });
    }
}
