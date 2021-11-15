const express = require("express");
const connection = require("./db");
const Joi = require("joi");

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
  const { max_price } = req.query;
  const valuesToEscape = [];
  let sql = "SELECT * FROM products";
  if (max_price) {
    sql += " WHERE price <= ?";
    valuesToEscape.push(max_price);
  }
  connection
    .promise()
    .query(sql, valuesToEscape)
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving products from db.");
    });
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  connection
    .promise()
    .query("SELECT * FROM products WHERE id = ?", [id])
    .then(([data]) => {
      if (data.length) {
        res.json(data[0]);
      } else {
        res.sendStatus(404);
      }
    });
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;
  const { error: validationErrors } = Joi.object({
    name: Joi.string().max(255).required(),
    price: Joi.number().min(0).required(),
  }).validate({ name, price }, { abortEarly: false });

  if (validationErrors) {
    res.status(422).json({ errors: validationErrors.details });
  } else {
    connection
      .promise()
      .query("INSERT INTO products (name, price) VALUES (?, ?)", [name, price])
      .then(([result]) => {
        const createdProduct = { id: result.insertId, name, price };
        res.json(createdProduct);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  }
});

app.patch("/products/:id", (req, res) => {
  const { error: validationErrors } = Joi.object({
    name: Joi.string().max(255),
    price: Joi.number().min(0),
  }).validate(req.body, { abortEarly: false });

  if (validationErrors)
    return res.status(422).json({ errors: validationErrors.details });

  connection
    .promise()
    .query("UPDATE products SET ? WHERE id = ?", [req.body, req.params.id])
    .then(([result]) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

app.delete("/products/:id", (req, res) => {
  if (user === ops) {
    connection
      .promise()
      .query("DELETE FROM products WHERE id = ?", [req.params.id])
      .then(([result]) => {
        if (result.affectedRows) res.sendStatus(204);
        else res.sendStatus(404);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  } else {
    res.send("vous n'avez pas les droits");
  }
});

app.listen(8000, () => {
  console.log("le server est lancé avec nodemon");
});
