const express = require("express");

const app = express();

app.use(express.json());

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

app.listen(8000, () => {
  console.log("le server est lancé avec nodemon");
});
