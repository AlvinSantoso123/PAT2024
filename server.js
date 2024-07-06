const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'alvin',
    password: 'p',
    database: 'pat_db',
});

conn.connect(function(err){
    if (err) throw err;
    console.log("connected to MySQL ....");
});

app.post('/api/account',function(req,res){ //buat bikin akun OK
    let data = {username: req.body.username, pass: req.body.pass, type: "user"};
    let sql = "INSERT INTO user SET ?";
    let query = conn.query(sql,data,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    });
});

app.post('/api/adminaccount',function(req,res){ //buat bikin akun OK
    let data = {username: req.body.username, pass: req.body.pass, type: "admin"};
    let sql = "INSERT INTO user SET ?";
    let query = conn.query(sql,data,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    });
});

app.post('/api/login',function(req,res){ //buat login OK
    let data = {username: req.body.username, pass: req.body.pass};
    let sql = "SELECT * FROM user WHERE username='"+req.body.username+"'";
    let query = conn.query(sql,data,function(err,result){
        if (err) throw err;
        if (result.length > 0) { //check if the user is found
            let user = result[0];
            if (user.pass === req.body.pass) {
                //password match, login success
                console.log(user.type);
                res.send(JSON.stringify({
                    "status" : 200,
                    "error" : null,
                    "response" : "Login successful",
                    "type" : user.type,
                    "id" : user.id
                }));
                console.log("Login successful");
            } else {
                //wrong password
                res.send(JSON.stringify({
                    "response" : "Invalid password"
                }));
                console.log("Invalid password");
            }
        } else {
            //invalid username
            res.send(JSON.stringify({
                "response" : "User not found"
            }));
            console.log("User not found");
        }
    });
});

app.post('/api/addorder',function(req,res){ //buat bikin pesanan OK
    let data = {berat_barang: req.body.berat_barang,
                alamat_pengambilan: req.body.alamat_pengambilan,
                alamat_pengiriman: req.body.alamat_pengiriman,
                harga: req.body.harga,
                //parameter lain (courier_pickup_id, courier_delivery_id, pickup, delivered) di api lain
            };

    let sql = "INSERT INTO orderinfo SET ?";
    let query = conn.query(sql,data,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    });
});

app.post('/api/addorder/:id',function(req,res){ //buat bikin pesanan OK
    let data = {berat_barang: req.body.berat_barang,
                alamat_pengambilan: req.body.alamat_pengambilan,
                alamat_pengiriman: req.body.alamat_pengiriman,
                harga: req.body.harga,
                customerid: req.params.id
                //parameter lain (courier_pickup_id, courier_delivery_id, pickup, delivered) di api lain
            };

    let sql = "INSERT INTO orderinfo SET ?";
    let query = conn.query(sql,data,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    });
});

app.put('/api/assign_pickup/:id',function(req,res){ //buat assign kurir jemput OK
    let sql = "UPDATE orderinfo SET courier_pickup_id="+req.body.courier_pickup_id+" WHERE order_id="+req.params.id;
    let query = conn.query(sql,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    })
});

app.put('/api/assign_deliver/:id',function(req,res){ //buat assign kurir antar OK
    let sql = "UPDATE orderinfo SET courier_deliver_id="+req.body.courier_deliver_id+" WHERE order_id="+req.params.id;
    let query = conn.query(sql,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    })
});

app.get('/api/getorder',function(req,res){ //tampilkan semua order OK
    let sql = "SELECT * FROM orderinfo";
    let query = conn.query(sql, function(err,result){
        if (err) throw err;
        res.send(JSON.stringify(
            {
                "status" : 200,
                "error" : null,
                "response" : result
            }
        ));
    });
});

app.get('/api/getorderid/:order_id',function(req,res){ //tampilkan order dengan id spesifik OK
    let sql = "SELECT * FROM orderinfo WHERE order_id="+req.params.order_id;
    let query = conn.query(sql, function(err,result){
        if (err) throw err;
        res.send(JSON.stringify(
            {
                "status" : 200,
                "error" : null,
                "response" : result
            }
        ));
    });
});

app.get('/api/customergetorder/:customerid',function(req,res){ //tampilkan order dengan id spesifik OK
    let sql = "SELECT * FROM orderinfo WHERE customerid="+req.params.customerid;
    let query = conn.query(sql, function(err,result){
        if (err) throw err;
        res.send(JSON.stringify(
            {
                "status" : 200,
                "error" : null,
                "response" : result
            }
        ));
        console.log(result);
    });
});

app.post('/api/courier/',function(req,res){ //buat daftarkan kurir baru OK
    let data = {name: req.body.name,
                license_plate: req.body.license_plate
            };

    let sql = "INSERT INTO courier SET ?";
    let query = conn.query(sql,data,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    });
});

app.put('/api/pickup/:id',function(req,res){ //buat menandakan kurir sudah jemput OK
    let sql = "UPDATE orderinfo SET pickup_status="+req.body.status+" WHERE order_id="+req.params.id;
    let query = conn.query(sql,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    })
});

app.put('/api/deliver/:id',function(req,res){ //buat menandakan kurir sudah antar OK
    let sql = "UPDATE orderinfo SET deliver_status="+req.body.status+" WHERE order_id="+req.params.id;
    let query = conn.query(sql,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({
            "status" : 200,
            "error" : null,
            "response" : result
        }));
    })
});

var server = app.listen(8000,function(){
    console.log("API Server running at port 8000");
});