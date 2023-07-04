import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css';

function App() {
  const [taskText, setTaskText] = useState("")
  const [tasksList, setTasksList] = useState([])
  const [isUpdating, setIsUpdating] = useState("")
  const [updateTaskText, setUpdateTaskText] = useState("")


  // add a new task to db
  const addTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/item", { item: taskText })
      setTasksList(prev => [...prev, res.data])
      setTaskText("")
    } catch (err) {
      console.log(err)
    }
  }

  // show all tasks in front end
  useEffect(() => {
    const getTasksList = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/items")
        setTasksList(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getTasksList()
  }, [])


  // update a task
  const updateTask = async (e)=>{
    e.preventDefault();
    try{
      const res = await axios.put(`http://localhost:5050/api/item/${isUpdating}`, {item: updateTaskText})
      const updatedTaskIndex = tasksList.findIndex(item => item._id === isUpdating)
      const updatedTask = tasksList[updatedTaskIndex].item = updateTaskText
      setUpdateTaskText("")
      setIsUpdating("")
    }catch(err){
      console.log(err)
    }
  }



  // modal window to update the task
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e)=>{updateTask(e)}}>
      <input className='update-new-input' type="text" placeholder="New Task" onChange={e=>{setUpdateTaskText(e.target.value)}} value={updateTaskText}></input>
      <button className='update-new-btn' type="submit">Update</button>
    </form>
  )


  // delete task
  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5050/api/item/${id}`)
      const newTasksList = tasksList.filter(item => item._id !== id);
      setTasksList(newTasksList)
    } catch (err) {
      console.log(err)
    }
  }


  return (
    <div className="App">
      <h1>To Do App</h1>
      <form className="form" onSubmit={e => addTask(e)}>
        <input type="text" placeholder="please add a new task" onChange={e => { setTaskText(e.target.value) }} value={taskText} ></input>
        <button type="submit">Add</button>
      </form>
      <div className="todo-list-tasks">
        {
          tasksList.map(item => (
            <div className="todo-task">
              {
                isUpdating === item._id
                  ? renderUpdateForm()
                  :
                  <>
                    <p className="task">{item.item}</p>
                    <button className="update" onClick={() => setIsUpdating(item._id)}>Update</button>
                    <button className="delete" onClick={() => deleteTask(item._id)}>Delete</button>
                  </>
              }

            </div>
          )
          )
        }
      </div>
    </div>
  );
}

export default App;
