import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class EditKost extends JFrame {
    private JLabel idLabel, alamatLabel, fasilitasLabel, hargaLabel, namakostLabel, stokLabel;
    private JTextField idTextField, alamatTextField, fasilitasTextField, hargaTextField, namakostField, stokTextField;
    private JButton editButton, backButton;

    public EditKost() {
        setTitle("Edit Kost");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BoxLayout(getContentPane(), BoxLayout.Y_AXIS));

        idLabel = new JLabel("ID");
        idTextField = new JTextField(20);
        namakostLabel = new JLabel("Nama Kost");
        namakostField = new JTextField(20);
        alamatLabel = new JLabel("Alamat");
        alamatTextField = new JTextField(20);
        fasilitasLabel = new JLabel("Fasilitas");
        fasilitasTextField = new JTextField(20);
        hargaLabel = new JLabel("Harga");
        hargaTextField = new JTextField(20);
        stokLabel = new JLabel("Kamar Tersedia");
        stokTextField = new JTextField(20);

        editButton = new JButton("Edit");
        editButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String id = idTextField.getText();
                String namakost = namakostField.getText();
                String alamat = alamatTextField.getText();
                String fasilitas = fasilitasTextField.getText();
                String harga = hargaTextField.getText();
                String stok = stokTextField.getText();

                if (id.isEmpty() || namakost.isEmpty() || alamat.isEmpty() || fasilitas.isEmpty() || harga.isEmpty()|| stok.isEmpty()) {
                    JOptionPane.showMessageDialog(null, "Masukkan semua data", "Validation Error", JOptionPane.ERROR_MESSAGE);
                    return;
                }

                try {
                    URL url = new URL("http://localhost:7000/editkost");
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("PUT");
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setDoOutput(true);

                    String requestBody = String.format("{\"list\":\"%s\",\"namakost\":\"%s\",\"alamat\":\"%s\",\"fasilitas\":\"%s\",\"harga\":\"%s\",\"stokkamar\":\"%s\"}", id, namakost, alamat, fasilitas, harga, stok);
                    conn.getOutputStream().write(requestBody.getBytes());

                    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();

                    JOptionPane.showMessageDialog(null, response.toString(), "Server Response", JOptionPane.INFORMATION_MESSAGE);
                } catch (IOException ex) {
                    ex.printStackTrace();
                    JOptionPane.showMessageDialog(null, "Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        });

        backButton = new JButton("Kembali");
        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dispose(); 
            }
        });

        JPanel formPanel = new JPanel();
        formPanel.setLayout(new BoxLayout(formPanel, BoxLayout.Y_AXIS));
        formPanel.add(idLabel);
        formPanel.add(idTextField);
        formPanel.add(namakostLabel);
        formPanel.add(namakostField);
        formPanel.add(alamatLabel);
        formPanel.add(alamatTextField);
        formPanel.add(fasilitasLabel);
        formPanel.add(fasilitasTextField);
        formPanel.add(hargaLabel);
        formPanel.add(hargaTextField);
        formPanel.add(stokLabel);
        formPanel.add(stokTextField);
        formPanel.add(editButton);
        formPanel.add(backButton);

        add(formPanel);

        pack();
        setLocationRelativeTo(null);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                new EditKost().setVisible(true);
            }
        });
    }
}
