const { MongoClient } = require("mongodb");

// The uri string must be the connection string for the database (obtained on Atlas).
const uri = "mongodb+srv://ExpressAccount:JvmdZ7svEXsLGfBn@cluster0.xheynkp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// --- This is the standard stuff to get it to work on the browser
const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes will go here

// Default route:
app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Starting... ';
  res.send(outstring);
});

app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '!');
});


// Route to access database:
app.get('/api/mongo/:item', function(req, res) {
  const client = new MongoClient(uri);
  const searchKey = "{ userID: '" + req.params.item + "' }"; // Adjusted to userID
  console.log("Looking for: " + searchKey);

  async function run() {
    try {
      const database = client.db('crlmdb');
      const parts = database.collection('credentials');

      // Hardwired Query for a part that has userID '12345'
      // const query = { userID: '12345', userPASS: 'password' };
      // But we will use the parameter provided with the route
      const query = { userID: req.params.item };

      const part = await parts.findOne(query);
      console.log(part);
      res.send('Found this: ' + JSON.stringify(part));  //Use stringify to print a json

    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
});
