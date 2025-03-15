const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  uploadFile,
  getTaskStats
} = require("../controllers/taskformcontrollers");
const upload = require("../middleware/upload");
const taskController = require("../controllers/taskformcontrollers");
// Task CRUD routes
router.post("/tasks/create", upload.single("file"), createTask);

// The error is happening on this line - getAllTasks is undefined
// Make sure getAllTasks is properly exported from taskformcontrollers.js
router.get("/tasks", getAllTasks || ((req, res) => {
  res.status(501).json({ message: "Get all tasks functionality not implemented yet" });
}));

router.get("/tasks/:id", getTaskById || ((req, res) => {
  res.status(501).json({ message: "Get task by ID functionality not implemented yet" });
}));
router.patch("/tasks/:id", updateTask || ((req, res) => {
  res.status(501).json({ message: "Update task functionality not implemented yet" });
}));
router.delete("/tasks/:id", deleteTask || ((req, res) => {
  res.status(501).json({ message: "Delete task functionality not implemented yet" });
}));
router.get("/tasks", taskController.getAllTasks);
// Task interaction routes
router.post("/tasks/:id/comment", addComment || ((req, res) => {
  res.status(501).json({ message: "Add comment functionality not implemented yet" });
}));
router.post("/tasks/:id/upload", upload.single("file"), uploadFile || ((req, res) => {
  res.status(501).json({ message: "Upload file functionality not implemented yet" });
}));

// Dashboard statistics
router.get("/tasks-stats", getTaskStats || ((req, res) => {
  res.status(501).json({ message: "Task statistics functionality not implemented yet" });
}));

module.exports = router;