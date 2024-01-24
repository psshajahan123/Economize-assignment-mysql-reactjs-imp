const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

const port = 5001;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ps1234",
  database: "learner",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("connected successfully");
});

//get specific todos
app.get("/GetTodos", (req, res) => {
  const { title } = req.query;
  const query = `select * from todos where name=${title}`;
  connection.query(query, function (err, result) {
    if (err) return res.send(err);
    else
      return res.json({
        data: result,
      });
  });
});

app.get("/", (req, res) => {
  const query = "select * from todos";
  connection.query(query, function (err, result) {
    if (err) return res.send(err);
    else
      return res.json({
        data: result,
      });
  });
});

//Update a todo
app.put("/:id", async (req, res) => {
  const { id, name, status } = req.body;
  const getTodoQuery = `UPDATE learner.todos SET name="${name}",status=${status} WHERE id=${id};`;
  connection.query(getTodoQuery);
});

//add todo
app.post("/AddTodo", (req, res) => {
  const { name, status } = req.body;
  const query = `INSERT INTO learner.todos (name,status) VALUES ("${name}","${status}");`;
  try {
    connection.query(query);

    return res.status(200).send("Todo added successfully");
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: error.message });
  }
  // connection.query(query, function (err, result) {
  //   if (err) return res.send(err);
  //   else return res.send("todo added!");
  // });
});

//delete todo
app.delete("/DeleteTodo/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  const query = `delete from todos where id=${id}`;
  connection.query(query, function (err, result) {
    if (err) return res.send(err);
    else
      return res.json({
        data: result,
      });
  });
});

app.listen(port, () => {
  console.log("listening on port " + port);
});
