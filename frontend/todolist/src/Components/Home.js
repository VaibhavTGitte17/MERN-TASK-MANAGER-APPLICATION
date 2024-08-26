import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openUpdateModal = (task) => {
    setCurrentTask(task);
    setTitle(task.title);
    setCategory(task.category);
    setDescription(task.description);
    setIsModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
    setTitle('');
    setCategory('');
    setDescription('');
  };



  const handleUpdateTask = async (e) => {
  e.preventDefault();
  if (currentTask) {
    try {
      console.log('Updating task:', {
        title,
        category,
        description,
      });

      const response = await axios.put(`http://localhost:5000/api/tasks/${currentTask._id}`, {
        title,
        category,
        description,
      });

      console.log('Update response:', response.data);

      setTasks(tasks.map(task => 
        task._id === currentTask._id ? response.data : task
      ));
      closeUpdateModal();

      console.log('Navigating to home...');
      navigate('/');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }
};




  return (
    <div className="container mx-auto p-4">
      <div className="shadow-lg p-6 bg-grey-500 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b" style={{ width: '10%' }}>SRNO</th>
              <th className="py-2 px-4 border-b" style={{ width: '20%' }}>Title</th>
              <th className="py-2 px-4 border-b" style={{ width: '20%' }}>Category</th>
              <th className="py-2 px-4 border-b" style={{ width: '40%' }}>Description</th>
              <th className="py-2 px-4 border-b" style={{ width: '20%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task._id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{task.title}</td>
                <td className="py-2 px-4 border-b">{task.category}</td>
                <td className="py-2 px-4 border-b">{task.description}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex">
                    <button
                      className="bg-blue-500 focus:outline-none focus:ring-blue-300 text-white px-4 py-2 rounded mr-2"
                      onClick={() => openUpdateModal(task)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 focus:outline-none focus:ring-red-300 text-white px-4 py-2 rounded"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Update Task</h2>
            <form onSubmit={handleUpdateTask}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Task Title"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="sport">Sport</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="science">Science</option>
                  <option value="tech">Information Technology</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Task Description"
                  required
                ></textarea>
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-900"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  onClick={closeUpdateModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
