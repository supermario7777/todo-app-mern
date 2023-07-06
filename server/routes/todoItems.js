const router = require("express").Router();

const { default: mongoose } = require("mongoose");
const TodoItemsModel = require("../models/todoitems")

// add item
router.post('/api/item', async (req, res) => {
    try {
        const newItem = new TodoItemsModel({
            item: req.body.item,
            status: "todo"
        })
        const saveItem = await newItem.save()
        res.status(200).json(saveItem)
    } catch (err) {
        res.json(err);
    }
})

// get all available data from db
router.get("/api/items", async (req, res) => {
    try {
        const allTodoItems = await TodoItemsModel.find({});
        res.status(200).json(allTodoItems)
    } catch (err) {
        res.json(err)
    }
})

// update item
router.put('/api/item/:id', async (req, res) => {
    try {
        const updateItem = await TodoItemsModel.findByIdAndUpdate(req.params.id, { $set: req.body })
        res.status(200).json("The item has been successfully updated")
    } catch (err) {
        res.json(err)
    }
})


// delete item
router.delete("/api/item/:id", async (req, res) => {
    try {
        const deleteItem = await TodoItemsModel.findByIdAndDelete(req.params.id);
        res.status(200).json("The item has been successfully deleted");
    } catch (err) {
        res.json(err);
    }
})


// change status to "in progress"
router.put("/api/item/in-progress/:id", async (req, res) => {
    try {
        const updateToInProgesss = await TodoItemsModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        res.status(200).json("The status has been successfully updated to 'in progress'");
    } catch {
        res.json(err);
    }
})

//change status to "done"
router.put("/api/item/done/:id", async (req, res) => {
    try {
        const updateToDone = await TodoItemsModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        res.status(200).json("The status has been successfully updated to 'done'");
    } catch {
        res.json(err);
    }
})

// change status "todo"
router.put("/api/item/todo/:id", async (req, res) => {
    try {
        const updateToTodo = await TodoItemsModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        res.status(200).json("The status has been successfully updated to 'todo'");
    } catch (err) {
        res.json(err);
    }
})



module.exports = router;