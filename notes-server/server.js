// index.js
const express = require('express');
const fs = require('fs');
const app = express();

const PORT = 4000;
const DATA_FILE = 'todos.json';

// Middleware to parse JSON
app.use(express.json());

// Helper function to read file
function readTodos() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return []; // Agar file nahi hai to empty array
    }
}

// Helper function to write file
function writeTodos(todos) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

// GET /notes → sab todos dikhaye
app.get('/notes', (req, res) => {
    const todos = readTodos();
    res.json(todos);
});

// POST /notes → naya todo add kare
app.post('/notes', (req, res) => {
    const todos = readTodos();
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const newTodo = {
        id: Date.now(), // simple unique id
        text
    };

    todos.push(newTodo);
    writeTodos(todos);

    res.status(201).json(newTodo);
});

// DELETE /notes/:id → todo delete kare
app.delete('/notes/:id', (req, res) => {
    const todos = readTodos();
    const id = parseInt(req.params.id);
    const newTodos = todos.filter(todo => todo.id !== id);

    if (todos.length === newTodos.length) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    writeTodos(newTodos);
    res.json({ message: 'Deleted successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${4000}`);
});