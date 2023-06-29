var express = require ('express');
var bodyparser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
var app = express();

app.use(bodyparser.json());
const {json} = require('body-parser');
const { connect } = require('http2');

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'kost'
});

conn.connect(function(err){
    if (err) throw err;
    console.log("MySQL connected...");
});


//login admin toko
app.post('/admin', function(req, res) {
    console.log("POST request /admin");

    let username = {user: req.body.username};
    json.getString
    console.log("POST request data ="+JSON.stringify(username.user));
    let password = {pass: req.body.password};
    console.log("POST request data ="+JSON.stringify(password.pass));
    let sql = "SELECT idadmin, nama FROM admin WHERE nama='"+username.user+"' AND password = '"+password.pass+"'";
    console.log(sql)
    let query = conn.query(sql, (err, result) => {
        console.log(JSON.stringify(
            {"status" : 200, "error" : null, "response" : result}
        ));
        if(result != "") {
            res.send("Login Berhasil")
        }
        else {
            res.send("Login Gagal")}
    });
});

//register akun user
app.post('/register', function(req, res) {
    console.log('POST request /register');
    let username = {user: req.body.username};
    json.getString
    console.log("POST request data ="+JSON.stringify(username.user));

    let password = {pass: req.body.password};
    console.log("POST request data ="+JSON.stringify(password.pass));

    let email = {mail: req.body.email};
    console.log("POST request data ="+JSON.stringify(email.mail));

    let check = "SELECT iduser FROM user WHERE nama ='"+username.user+"'";

    let checker = conn.query(check, (err, checkresult)=>{
        console.log(JSON.stringify(
            {
                "status" : 200,
                "error" : null,
                "response" : checkresult
            }
        ));
        console.log(checkresult);
        if (checkresult == ""){
            let sql = "INSERT INTO user (nama, password, email) VALUES ('"+username.user+"','"+password.pass+"','"+email.mail+"')";
            let query = conn.query(sql, (err, result) =>{
                console.log(JSON.stringify(
                    {
                        "status" : 200,
                        "error" : null,
                        "response" : result
                    }
                ));
                conn.query(check, (err, checkresult) => {
                    console.log(JSON.stringify(
                        {
                            "status" : 200,
                            "error" : null,
                            "response" : checkresult
                        }
                    ));
                });
                res.send("Pendaftaran Berhasil")
            });
        }
        else {
            res.send("Pendaftaran Gagal")
        }
    })
});

//login user
app.post('/login', function(req, res) {
    console.log("POST request /login");
    let username = {user: req.body.username};
    let password = {pass: req.body.password};
  
    let sql = "SELECT iduser, nama FROM user WHERE nama='"+username.user+"' AND password = '"+password.pass+"'";
    console.log(sql);
  
    let query = conn.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ status: 500, error: 'Internal Server Error', response: null });
      } else {
        if (result.length > 0) {
          res.status(200).json({ status: 200, error: null, response: 'Login Berhasil' });
        } else {
          res.status(401).json({ status: 401, error: 'Unauthorized', response: 'Login Gagal' });
        }
      }
    });
  });

//list kost
app.get('/listkost', function(req, res) {
    console.log('Menerima GET request /listkost');
    let sql = "SELECT * FROM listkost";
    let query = conn.query(sql, function(err, result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    });
});

//list booking
app.get('/listbooking', function(req, res) {
    console.log('Menerima GET request /listbooking');
    let sql = "SELECT * FROM booking";
    let query = conn.query(sql, function(err, result) {
        if (err) throw err;

        console.log(JSON.stringify({
            "status": 200,
            "error": null,
            "response": result
        }));

        res.send(JSON.stringify({
            "status": 200,
            "error": null,
            "response": result
        }));
    });
});

//edit list kost
app.put('/editkost', function(req, res) {
    let alamat = {Alamat: req.body.alamat};
    let namakost = {Namakost: req.body.namakost};
    let fasilitas = {Fasilitas: req.body.fasilitas};
    let harga = {Harga: req.body.harga};
    let id = {Id: req.body.id};
    let stokkamar = {Stok: req.body.stokkamar};
    console.log(alamat)
    console.log(fasilitas)
    console.log(harga)
    console.log(stokkamar)
    console.log(id)
    let sql = "UPDATE listkost SET alamat='"+alamat.Alamat+"', fasilitas='"+fasilitas.Fasilitas+"', harga='"+harga.Harga+"', namakost='"+namakost.Namakost+"', kamarkosong='"+stokkamar.Stok+"' WHERE idkost='"+id.Id+"'";
    let query = conn.query(sql, (err, result) => {
        console.log(JSON.stringify(
            {
                "status" : 200,
                "error" : null,
                "response" : result
            }
        ));
        console.log(sql)
        if(result.affectedRows == "0") {
            res.send ("Gagal Edit Data")
        }
        else {
            res.send ("Berhasil Mengedit Data")
        }
    })
});

//tambah kost
app.post('/tambahkost', function(req, res) {
    console.log('POST request /tambahkost');

    let alamatkost = {alamat: req.body.alamatkost};
    console.log("POST request data ="+JSON.stringify(alamatkost.alamat));

    let namakost = {nama: req.body.namakost};
    console.log("POST request data ="+JSON.stringify(namakost.nama));

    let fasilitaskost = {fasilitas: req.body.fasilitaskost};
    console.log("POST request data ="+JSON.stringify(fasilitaskost.fasilitas));

    let hargakost = {harga: req.body.hargakost};
    console.log("POST request data ="+JSON.stringify(hargakost.harga));

    let kamarkosong = {kamar: req.body.kamarkosong};
    console.log("POST request data ="+JSON.stringify(kamarkosong.kamar));

    let check = "SELECT idkost FROM listkost WHERE alamat ='"+alamatkost.alamat+"'";

    let checker = conn.query(check, (err, checkresult)=>{
        console.log(JSON.stringify(
            {
                "status" : 200,
                "error" : null,
                "response" : checkresult
            }
        ));
        console.log(checkresult);
        if (checkresult == ""){
            let sql = "INSERT INTO listkost (alamat, fasilitas, harga, namakost, kamarkosong) VALUES ('"+alamatkost.alamat+"','"+fasilitaskost.fasilitas+"','"+hargakost.harga+"','"+namakost.nama+"','"+kamarkosong.kamar+"')";
            let query = conn.query(sql, (err, result) =>{
                console.log(JSON.stringify(
                    {
                        "status" : 200,
                        "error" : null,
                        "response" : result
                    }
                ));
                conn.query(check, (err, checkresult) => {
                    console.log(JSON.stringify(
                        {
                            "status" : 200,
                            "error" : null,
                            "response" : checkresult
                        }
                    ));
                });
                res.send("Berhasil Menambah")
            });
        }
        else {
            res.send("Gagal Menambah")
        }
    })
});

//booking
app.post('/booking', function(req, res) {
    console.log("POST request /booking");
    const username = req.body.username;
    const telepon = req.body.telepon;
    const namakost = req.body.namakost;
  
    const checkAvailabilityQuery = "SELECT kamarkosong FROM listkost WHERE namakost = ?";
    const checkAvailabilityParams = [namakost];
  
    conn.query(checkAvailabilityQuery, checkAvailabilityParams, (err, availabilityResult) => {
      if (err) {
        console.error(err);
        res.status(500).json({ status: 500, error: 'Internal Server Error', response: null });
      } else {
        if (availabilityResult.length > 0 && availabilityResult[0].kamarkosong > 0) {
          const insertBookingQuery = "INSERT INTO booking (nama, telepon, namakost) VALUES (?, ?, ?)";
          const insertBookingParams = [username, telepon, namakost];
  
          conn.query(insertBookingQuery, insertBookingParams, (err, bookingResult) => {
            if (err) {
              console.error(err);
              res.status(500).json({ status: 500, error: 'Internal Server Error', response: null });
            } else {
              if (bookingResult.affectedRows > 0) {
                const bookingId = bookingResult.insertId;
  
                const updateAvailabilityQuery = "UPDATE listkost SET kamarkosong = kamarkosong - 1 WHERE namakost = ?";
                const updateAvailabilityParams = [namakost];
  
                conn.query(updateAvailabilityQuery, updateAvailabilityParams, (err, updateResult) => {
                  if (err) {
                    console.error(err);
                    res.status(500).json({ status: 500, error: 'Internal Server Error', response: null });
                  } else {
                    console.log("Booking data inserted.");
  
                    const bookingInfo = {
                      id: bookingId,
                      nama: username,
                      telepon: telepon,
                      namakost: namakost
                    };
  
                    res.status(200).json(bookingInfo);
                  }
                });
              } else {
                res.status(500).json({ status: 500, error: 'Internal Server Error', response: null });
              }
            }
          });
        } else {
          res.status(400).json({ status: 400, error: 'Bad Request', response: 'Kamar sudah penuh' });
        }
      }
    });
  });  
  

var server = app.listen(7000, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Express app listening at http://%s:%s", host, port);
})