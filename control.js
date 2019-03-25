var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
const mongoose = require('mongoose');


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbs = 'myproject';

MongoClient.connect(url, function(error, client) {
  assert.equal(null, error);
  console.log("Connected successfully to server");

  const db = client.db(dbs);

  client.close();
});

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/post-feedback', function (req, res) {
    dbs.then(function(db) {
        delete req.body._id; // for safety reasons
        db.collection('feedbacks').insertOne(req.body);
    });    
    res.send('Data received:\n' + JSON.stringify(req.body));
});

app.get('/view-feedbacks',  function(req, res) {
    dbs.then(function(db) {
        db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
            res.status(200).json(feedbacks);
        });
    });
});

app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );