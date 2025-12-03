// index.js

const express = require("express");

const app = express();
app.use(express.json());

const port = 3000;

const todos = [
    { id: "1", title: "Buy groceries" },
    { id: "2", title: "Install Aspecto" },
    { id: "3", title: "buy my own name domain" },
];

app.get("/todo", (req, res) => {
    res.json(todos);
});

app.get("/todo/:id", (req, res) => {
    const todo = todos.find((t) => t.id === req.params.id);
    if (!todo) {
        return res.status(404).json({ error: "Not found" });
    }
    res.json(todo);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
