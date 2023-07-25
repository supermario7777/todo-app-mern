import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css';

function App() {
  const [taskText, setTaskText] = useState("")
  const [tasksList, setTasksList] = useState([])
  const [isUpdating, setIsUpdating] = useState("")
  const [updateTaskText, setUpdateTaskText] = useState("")
  const [currentStatus, setCurrentStatus] = useState("todo")
  const [count, setCount] = useState(0); // to re-render the web page


  // update currentStatus to "todo" category
  const updateCurrentStatusToToDo = () => {
    setCurrentStatus("todo")
  }

  // update currentStatus to "in-progress" category
  const updateCurrentStatusToInProgress = () => {
    setCurrentStatus("in-progress")
  }

  // update currentStatus to "done" category
  const updateCurrentStatusToDone = () => {
    setCurrentStatus("done")
  }

  // add a new task to db
  const addTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://todo-app-mern-cyan.vercel.app/api/item", { item: taskText })
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
        const res = await axios.get("https://todo-app-mern-cyan.vercel.app/api/items")
        const filteredData = res.data.filter(tasks => tasks.status === currentStatus)
        // console.log(filteredData)
        setTasksList(filteredData)
      } catch (err) {
        console.log(err)
      }
    }
    getTasksList()
  }, [count, currentStatus])


  // update a task
  const updateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`https://todo-app-mern-cyan.vercel.app/api/item/${isUpdating}`, { item: updateTaskText })
      const updatedTaskIndex = tasksList.findIndex(item => item._id === isUpdating)
      const updatedTask = tasksList[updatedTaskIndex].item = updateTaskText
      setUpdateTaskText("")
      setIsUpdating("")
    } catch (err) {
      console.log(err)
    }
  }

  // modal window to update the task
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => { updateTask(e) }}>
      <input className='update-new-input' type="text" placeholder="please update the task" onChange={e => { setUpdateTaskText(e.target.value) }} value={updateTaskText}></input>
      <button className='update-new-btn' type="submit">Save</button>
    </form>
  )


  // delete task
  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`https://todo-app-mern-cyan.vercel.app/api/item/${id}`)
      const newTasksList = tasksList.filter(item => item._id !== id);
      setTasksList(newTasksList)
    } catch (err) {
      console.log(err)
    }
  }


  // change statuses

  // change status to "todo"
  const changeStatusToTodo = async (item) => {
    try {
      const res = await axios.put(`https://todo-app-mern-cyan.vercel.app/api/item/todo/${item._id}`, { status: "todo" })
      setCount(count + 1);
    } catch (err) {
      console.log(err)
    }
  }

  // change status to "in-progress"
  const changeStatusToInProgress = async (item) => {
    try {
      const res = await axios.put(`https://todo-app-mern-cyan.vercel.app/api/item/in-progress/${item._id}`, { status: "in-progress" })
      setCount(count + 1);
    } catch (err) {
      console.log(err)
    }
  }

  const changeStatusToDone = async (item) => {
    try {
      const res = await axios.put(`https://todo-app-mern-cyan.vercel.app/api/item/done/${item._id}`, { status: "done" })
      setCount(count + 1);
    } catch (err) {
      console.log(err)
    }
  }



  return (
    <div className="App">
      <h2>ToDo App</h2>
      <form className="form" onSubmit={e => addTask(e)}>
        <input type="text" className='main-input' placeholder="please add a new task" onChange={e => { setTaskText(e.target.value) }} value={taskText} ></input>
        <button type="submit" className='add' onClick={()=> setCount(count + 1)}>Add</button>
      </form>
      <div className='statuses'>
        <button style={currentStatus === "todo" ? { color: 'white', background: "black", borderRadius: "2px 0px 0px 0px" } : { color: "black", background: "white", borderBottom: "1px solid black" }} className='filter-by-status-btn' onClick={updateCurrentStatusToToDo}>ToDo</button>
        <button style={currentStatus === "in-progress" ? { color: 'white', background: "black" } : { color: "black", background: "white", borderBottom: "1px solid black" }} className='filter-by-status-btn' onClick={updateCurrentStatusToInProgress}>In-Progress</button>
        <button style={currentStatus === "done" ? { color: 'white', background: "black", borderRadius: "0px 2px 0px 0px" } : { color: "black", background: "white", borderBottom: "1px solid black" }} className='filter-by-status-btn' onClick={updateCurrentStatusToDone}>Done</button>
      </div>
      <div className="todo-list-tasks">
        {
          tasksList.map((item) => (
            <div className="todo-task" key={item._id}>
              {
                isUpdating === item._id
                  ? renderUpdateForm()
                  :
                  <>
                    <p className="task">{item.item}</p>
                    <button className="todo" onClick={() => changeStatusToTodo(item)}>ToDo</button>
                    <button className="in-progress" onClick={() => changeStatusToInProgress(item)}>In-Progress</button>
                    <button className="done" onClick={() => { changeStatusToDone(item) }}>Done</button>
                    <button className="update" onClick={() => { setIsUpdating(item._id) }}>Update</button>
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
