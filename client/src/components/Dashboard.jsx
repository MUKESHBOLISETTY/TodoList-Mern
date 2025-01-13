import React, { useContext, useState, useEffect } from 'react'
import { DashboardContext } from '../DashboardView';
import Settings from './Settings';
import Popup from './Popup';
import { createTask, deleteTask, editTask, getTasks } from '../api/task';
import { DataContext } from '../UserDetails';
import { Filter } from 'bad-words';
const Dashboard = ({ setNavComponent }) => {
  const { userdata } = useContext(DataContext);
  const { tab, setTab } = useContext(DashboardContext);
  const [popupMessage, setPopupMessage] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTaskForm, setEditShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    remindThroughMail: false,
  });
  const [tasks, setTasks] = useState([]);
  const [taskid, setTaskId] = useState('');
  const filter = new Filter();
  const fetchData = async () => {
    try {
      const response = await getTasks(userdata.user);
      if (response == 'notaksfound') {
        return;
      } else if (response.status) {
        setTasks(response.details)
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchData()
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (taskForm.title.length > 70) {
      setPopupMessage('Title Max Length (70)');
      setTimeout(() => setPopupMessage(null), 3000);
    } else if (taskForm.description.length > 270) {
      setPopupMessage('Description Max Length (270)');
      setTimeout(() => setPopupMessage(null), 3000);
    } else {
      const response = await createTask(filter.clean(taskForm.title), filter.clean(taskForm.description), taskForm.remindThroughMail, userdata.user);
      if (response == 'invaliduser') {
        setPopupMessage('User Not Exists');
        setTimeout(() => setPopupMessage(null), 3000);
      }
      if (response == 'created') {
        setPopupMessage('Task created successfully!');
        setTimeout(() => setPopupMessage(null), 3000);
        setShowTaskForm(false);
        setTaskForm({ title: '', description: '', remindThroughMail: false });
        fetchData()
      }
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await deleteTask(userdata.user, id);
      if (response == 'invaliduser') {
        setPopupMessage('User Not Exists');
        setTimeout(() => setPopupMessage(null), 3000);
      }
      if (response == 'taskdeleted') {
        setPopupMessage('Task deleted successfully!');
        setTimeout(() => setPopupMessage(null), 3000);
        fetchData()
      }
      if (response == 'notaksfound') {
        setPopupMessage('Something went wrong!');
        setTimeout(() => setPopupMessage(null), 3000);
      }
    } catch (error) {
      setPopupMessage('Something went wrong!');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };
  const handleEditTask = async (id) => {
    try {
      const { title, description, remindThroughMail } = taskForm;
      const updateTask = {
        title: filter.clean(title) || "",
        description: filter.clean(description) || "",
        remindThroughMail: remindThroughMail.toString()
      }
      const response = await editTask(userdata.user, id, updateTask.title, updateTask.description, updateTask.remindThroughMail);
      if (response == 'notaksfound' || response == 'notchanged') {
        setPopupMessage('Something went wrong!');
        setTimeout(() => setPopupMessage(null), 3000);
      } else if (response == 'changed') {
        setPopupMessage('Successfully Changed');
        setTimeout(() => setPopupMessage(null), 3000);
      }
      fetchData()

    } catch (error) {
      setPopupMessage('Something went wrong!');
      setTimeout(() => setPopupMessage(null), 3000);
    }
  };


  const TabView = () => {
    const tabs = {
      'settings': <Settings setNavComponent={setNavComponent} />
    }
    return tabs[tab];
  }
  return (
    <>
      {tab ? TabView() :
        <div className="h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <button
              className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
              onClick={() => {
                setShowTaskForm(true);
                setTaskForm({ title: '', description: '', remindThroughMail: false });
              }}
            >
              Create Task
            </button>
          </div>

          {/* Tasks Section */}
          <div className="p-4 space-y-4">
            {tasks.map((task) => (
              <div
                key={task.taskId}
                className="p-4 bg-white rounded-lg shadow border-2 hover:border-red-400 flex justify-between items-start"
              >
                <div>
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <p className="text-gray-600">{task.description}</p>
                  {task.notify && (
                    <span className="text-sm font-semibold text-red-500">Notify Mode On</span>
                  )}
                </div>
                <div className="space-x-2">
                  <button
                    className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    onClick={() => {
                      setEditShowTaskForm(true);
                      setTaskId(task.taskId);
                      setTaskForm({ title: task.title, description: task.description, remindThroughMail: task.notify });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleDeleteTask(task.taskId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-gray-500 text-center">No tasks available. Create a new task!</p>
            )}
          </div>

          {/* Create Task Form */}
          {showTaskForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <form
                onSubmit={handleCreateTask}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              >
                <h2 className="text-lg font-bold mb-4">Create Task</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={taskForm.remindThroughMail}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, remindThroughMail: e.target.checked })
                      }
                      className="mr-2"
                    />
                    Remind through mail
                  </label>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
                    onClick={() => setShowTaskForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          )}

          {editTaskForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleEditTask(taskid)
                }}
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              >
                <h2 className="text-lg font-bold mb-4">Edit Task</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={taskForm.remindThroughMail}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, remindThroughMail: e.target.checked })
                      }
                      className="mr-2"
                    />
                    Remind through mail
                  </label>
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
                    onClick={() => setEditShowTaskForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
                  >
                    Edit Task
                  </button>
                </div>
              </form>
            </div>
          )}

          {popupMessage && <Popup popupmessage={popupMessage} />}
        </div>
      }
    </>
  )
}

export default Dashboard