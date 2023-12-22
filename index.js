const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jbprl6s.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //   database collection
    const todoTaskCollection = client
      .db("taskManagementDB")
      .collection("todoList");

    app.post("/todo", async (req, res) => {
      const dataList = req.body;
      const result = await todoTaskCollection.insertOne(dataList);
      res.send(result);
    });

    app.get("/todo", async (req, res) => {
      const result = await todoTaskCollection.find().toArray();
      res.send(result);
    });
    app.get("/todo/:id", async (req, res) => {
      const result = await todoTaskCollection.findOne();
      res.send(result);
    });
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await todoTaskCollection.deleteOne(filter);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// server running

app.get("/", (req, res) => {
  res.send("task management is rinning");
});

app.listen(port, () => {
  console.log(`task nmanagemnet running port is:${port}`);
});
