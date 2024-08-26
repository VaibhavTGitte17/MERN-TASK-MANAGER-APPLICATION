const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/taskmanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.post('/api/tasks', async (req, res) => {
  const { title, category, description } = req.body;
  const newTask = new Task({ title, category, description });

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching tasks', error });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task', error });
  }
});




// Ensure that this part of the code is present in your server file
app.put('/api/tasks/:id', async (req, res) => {
  const { title, category, description } = req.body;
  console.log('Updating task with ID:', req.params.id);
  console.log('Update data:', { title, category, description });

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, category, description },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      console.log('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task updated:', updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: 'Error updating task', error });
  }
});
