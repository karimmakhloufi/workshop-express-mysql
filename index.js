const express = require("express");
const connection = require("./db");

const app = express();
app.use(express.json());

connection.connect((err) => {
  if (err) {
    console.error("error connecting to db");
  } else {
    console.log("connected to db");
  }
});

const things = [
  { id: 1, name: "Socks" },
  { id: 2, name: "Computer" },
  { id: 3, name: "Passion" },
];

let newId = 4;

app.get("/things", (req, res) => {
  res.send(things);
});

app.get("/things/:id", (req, res) => {
  const parsedThingId = parseInt(req.params.id);
  const thing = things.find((thing) => thing.id === parsedThingId);
  if (thing) {
    res.send(thing);
  } else {
    res.sendStatus(404);
  }
});

app.post("/things", (req, res) => {
  const { name } = req.body;
  things.push({ id: newId, name: name });
  res.status(201).send({ id: newId, name: name });
  newId++;
});

app.get("/", (req, res) => {
  console.log("get was called");
  res.send("Hello from express with nodemon");
});

app.get("/products", (req, res) => {
  connection
    .promise()
    .query("SELECT * FROM products")
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving products from db.");
    });
});

app.listen(8000, () => {
  console.log("le server est lancé avec nodemon");
});
