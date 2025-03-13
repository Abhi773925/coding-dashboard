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

// Task CRUD routes
router.post("/tasks/create", upload.single("file"), createTask);
router.get("/tasks", getAllTasks);
router.get("/tasks/:id", getTaskById);
router.patch("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

// Task interaction routes
router.post("/tasks/:id/comment", addComment);
router.post("/tasks/:id/upload", upload.single("file"), uploadFile);

// Dashboard statistics
router.get("/tasks-stats", getTaskStats);

module.exports = router;