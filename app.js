var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/web1');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback) {

    console.log("connection succeeded");
})

var app = express()
app.use(bodyParser.json());
app.use(express.static('./'));
app.use(bodyParser.urlencoded({

    extended: true
}));


//Sign Up
app.post('/sign_up', function(req, res) {
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var pass = req.body.pass;
    var cpass = req.body.cpass;

    var data = {

        "name": name,
        "phone": phone,

        "email": email,

        "password": pass,
        "connpassword": cpass



    }

    db.collection('details').insertOne(data, function(err, collection) {

        if (err) throw err;
        console.log("Record inserted Successfully");

    });
    return res.redirect('index.html');
})


//Log In
app.get('/login', function(req, res, next) {
    return res.render('index.html');

});

app.post('/login', function(req, res, next) {
    db.collection('details').findOne({ name: req.body.name },
        function(err, data) {
            if (data) {
                if (data.password == req.body.password) {
                    // req.session.userId=data.unique_id;
                    return res.redirect('home.html');
                } else {

                    res.send("Wrong password !");
                    //res.redirect('index.html');




                }
            } else {
                res.send("This Username is not registered");
                //res.redirect('index.html');
            }
        });
});

//FOrgot Password
app.post('/reset', function(req, res, next) {
    var name = req.body.name;
    var pass = req.body.pass;
    var cpass = req.body.cpass; 
    var username={"name":name}
    var newpass = {
        
            "password": pass,
            "connpassword": cpass    
             
    }
    db.collection('details').findOne({ name: req.body.name },
        function(err, data) {
            if (data) {
    db.collection("details").updateOne(username,{$set:newpass}, function(err, res) {
        if (err) throw err;
        console.log("updated");
        
      });  
      return res.redirect('index.html');
    }
    else
    {
        res.send("This Username is not registered");
        //res.redirect('index.html');
    }
});

});



//Message

app.post('/message', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var sub = req.body.subject;
    var msg = req.body.message;

    var data = {

        "name": name,
        "email": email,
        "subject": sub,
        "message": msg




    }

    db.collection('message').insertmany(data, function(err, collection) {

        if (err) throw err;
        console.log("Record inserted Successfully");
        //res.render({Success:"Thank you for Contacting with us team will reach out to you soon."}) 

    });
    //return res.redirect('home.html'); 
})




app.get('/', function(req, res) {
    res.set({

        'Access-control-Allow-Origin': '*'

    });

    return res.redirect('index.html');
}).listen(3000)

console.log("server listening at port 3000");