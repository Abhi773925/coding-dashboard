const Task = require("../models/taskformmodels");
const User = require("../models/User");
const { createNotification } = require("./notificationcontroller");

exports.getAllTasks = async (req, res) => {
  try {
    // Get email from query parameter
    const userEmail = req.query.email;
    console.log("User email from query:", userEmail);
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }

    let tasks;
    // Check if user is admin
    if (userEmail === "rockabhisheksingh778189@gmail.com") {
      // Admin user sees all tasks
      tasks = await Task.find().sort({ deadline: 1 }); // Sort by deadline ascending
    } else {
      // Normal users see only their assigned tasks
      tasks = await Task.find({ assignedTo: userEmail }).sort({ deadline: 1 });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to load tasks", error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "❌ Task not found" });
    }
    
    // Check if the user has permission to view this task
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    if (userEmail !== "rockabhisheksingh778189@gmail.com" && task.assignedTo !== userEmail) {
      return res.status(403).json({ message: "❌ You don't have permission to view this task" });
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to load task details", error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, role, comments, priority } = req.body;
    const userEmail = req.query.email || req.body.email;
    
    // Parse assignedTo as JSON if it's a string array
    let assignedTo = req.body.assignedTo;
    if (typeof assignedTo === 'string') {
      try {
        assignedTo = JSON.parse(assignedTo);
      } catch (e) {
        // If parsing fails, treat it as a single email
        assignedTo = [assignedTo];
      }
    } else if (!Array.isArray(assignedTo)) {
      // If it's not an array already, convert it to one
      assignedTo = [assignedTo];
    }
    
    // Make sure we have at least one assignee
    if (!assignedTo || assignedTo.length === 0) {
      return res.status(400).json({ message: "❌ At least one assignee email is required" });
    }
    
    if (!title || !deadline || !priority) {
      return res.status(400).json({ message: "❌ Title, deadline, and priority are required" });
    }
    
    // Check if all assigned users exist
    const invalidUsers = [];
    for (const email of assignedTo) {
      const user = await User.findOne({ email });
      if (!user) {
        invalidUsers.push(email);
      }
    }
    
    if (invalidUsers.length > 0) {
      return res.status(400).json({ 
        message: `❌ Invalid assignee email(s): ${invalidUsers.join(', ')}. User(s) not found.` 
      });
    }
    
    // Create task objects for each assignee
    const tasks = [];
    
    for (const email of assignedTo) {
      const task = new Task({
        title,
        description,
        assignedTo: email,
        deadline,
        file: req.file ? req.file.filename : null,
        role,
        priority,
        status: "Pending",
        createdBy: userEmail || assignedTo[0], // If no creator email provided, use first assignee
        createdAt: new Date(),
        teamTask: true, // Flag indicating this is part of a team task
        teamMembers: assignedTo, // Store all team members for reference
        comments: [] // Initialize an empty array for comments
      });
      
      // Add comments if provided
      if (comments && comments.trim()) {
        const commentObj = {
          text: comments.trim(),
          user: userEmail || assignedTo[0],
          date: new Date()
        };
        task.comments.push(commentObj);
      }
      
      await task.save();
      tasks.push(task);
      
      // Create notification for each assignee
      try {
        console.log(`Creating notification for assignee: ${email}`);
        await createNotification(
          email, // recipient (the assignee)
          `New task assigned: ${title}`,
          task._id,
          'task_assigned',
          userEmail || assignedTo[0] // creator
        );
        console.log(`Notification created successfully for: ${email}`);
      } catch (notificationError) {
        console.error(`Error creating notification for ${email}:`, notificationError);
        // Continue processing even if notification fails
      }
    }
    
    res.status(201).json({ 
      message: `✅ Task successfully assigned to ${assignedTo.length} team member(s)`, 
      tasks,
      assignedTo
    });
  } catch (error) {
    console.error("❌ Error creating team task:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// exports.updateTask = async (req, res) => {
//   try {
//     const taskId = req.params.id;
//     const userEmail = req.query.email;
    
//     if (!userEmail) {
//       return res.status(400).json({ message: "❌ User email is required" });
//     }
    
//     console.log("Update task:", taskId, req.body);
    
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ message: "❌ Task not found" });
//     }
    
//     // Check if user has permission to update this task
//     if (userEmail !== "rockabhisheksingh778189@gmail.com" && task.assignedTo !== userEmail) {
//       return res.status(403).json({ message: "❌ You don't have permission to update this task" });
//     }
    
//     // Check if status is changing
//     const statusChanged = req.body.status && req.body.status !== task.status;
    
//     // If status is changing to "Done", add a timestamp
//     if (req.body.status === "Done" && task.status !== "Done") {
//       req.body.completedAt = new Date();
//     }
    
//     // Update the task
//     const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
    
//     // Create notifications after successful update
//     try {
//       if (statusChanged) {
//         // If status changed, notify the task creator and team members (if not the updater)
//         console.log(`Status changed to: ${updatedTask.status}, creating notifications`);
        
//         // Notify the task creator if they're not the updater
//         if (updatedTask.createdBy && updatedTask.createdBy !== userEmail) {
//           await createNotification(
//             updatedTask.createdBy,
//             `Task "${updatedTask.title}" status updated to ${updatedTask.status}`,
//             updatedTask._id,
//             'status_changed',
//             userEmail
//           );
//           console.log(`Notification sent to creator: ${updatedTask.createdBy}`);
//         }
        
//         // If this is a team task, notify other team members
//         if (updatedTask.teamMembers && updatedTask.teamMembers.length > 0) {
//           for (const member of updatedTask.teamMembers) {
//             if (member !== userEmail && member !== updatedTask.assignedTo) {
//               await createNotification(
//                 member,
//                 `Team task "${updatedTask.title}" status updated to ${updatedTask.status}`,
//                 updatedTask._id,
//                 'status_changed',
//                 userEmail
//               );
//               console.log(`Team notification sent to: ${member}`);
//             }
//           }
//         }
        
//         // Notify the assignee if they're not the updater
//         if (updatedTask.assignedTo !== userEmail) {
//           await createNotification(
//             updatedTask.assignedTo,
//             `Task "${updatedTask.title}" status updated to ${updatedTask.status}`,
//             updatedTask._id,
//             'status_changed',
//             userEmail
//           );
//           console.log(`Notification sent to assignee: ${updatedTask.assignedTo}`);
//         }
//       } else if (Object.keys(req.body).length > 0) {
//         // For other updates, notify relevant parties
//         console.log(`Task updated (non-status change), creating notifications`);
        
//         // Notify the assignee if they're not the updater
//         if (updatedTask.assignedTo !== userEmail) {
//           await createNotification(
//             updatedTask.assignedTo,
//             `Task "${updatedTask.title}" has been updated`,
//             updatedTask._id,
//             'task_updated',
//             userEmail
//           );
//           console.log(`Update notification sent to assignee: ${updatedTask.assignedTo}`);
//         }
        
//         // Notify the creator if they're not the updater or assignee
//         if (updatedTask.createdBy && 
//             updatedTask.createdBy !== userEmail && 
//             updatedTask.createdBy !== updatedTask.assignedTo) {
//           await createNotification(
//             updatedTask.createdBy,
//             `Task "${updatedTask.title}" has been updated`,
//             updatedTask._id,
//             'task_updated',
//             userEmail
//           );
//           console.log(`Update notification sent to creator: ${updatedTask.createdBy}`);
//         }
//       }
//     } catch (notificationError) {
//       console.error("Error creating notifications:", notificationError);
//       // Continue execution even if notifications fail
//     }
    
//     res.status(200).json({ message: "✅ Task updated successfully", task: updatedTask });
//   } catch (error) {
//     console.error("Error updating task:", error);
//     res.status(500).json({ message: "❌ Server error", error: error.message });
//   }
// };
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    console.log("Update task:", taskId, "by:", userEmail, "data:", req.body);
    
    // Get the task before update
    const originalTask = await Task.findById(taskId);
    if (!originalTask) {
      return res.status(404).json({ message: "❌ Task not found" });
    }
    
    // Check if user has permission to update this task
    if (userEmail !== "rockabhisheksingh778189@gmail.com" && originalTask.assignedTo !== userEmail) {
      return res.status(403).json({ message: "❌ You don't have permission to update this task" });
    }
    
    // Check if status is changing
    const statusChanged = req.body.status && req.body.status !== originalTask.status;
    const oldStatus = originalTask.status;
    const newStatus = req.body.status;
    
    // If status is changing to "Done", add a timestamp
    if (req.body.status === "Done" && originalTask.status !== "Done") {
      req.body.completedAt = new Date();
    }
    
    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      return res.status(500).json({ message: "❌ Failed to update task" });
    }
    
    // Get task fields that were updated
    const updatedFields = Object.keys(req.body);
    console.log("Updated fields:", updatedFields);
    
    // Create notifications after successful update
    try {
      if (statusChanged) {
        console.log(`Status changed from ${oldStatus} to ${newStatus}`);
        
        // Notification message for status change
        const statusMessage = `Task "${updatedTask.title}" status changed from ${oldStatus} to ${newStatus}`;
        
        // Create notification for the assignee if they're not the updater
        if (updatedTask.assignedTo && updatedTask.assignedTo !== userEmail) {
          const assigneeNotification = await createNotification(
            updatedTask.assignedTo,
            statusMessage,
            updatedTask._id,
            'status_changed',
            userEmail
          );
          console.log("Assignee notification created:", assigneeNotification ? assigneeNotification._id : "failed");
        }
        
        // Create notification for the creator if they're not the updater or assignee
        if (updatedTask.createdBy && 
            updatedTask.createdBy !== userEmail && 
            updatedTask.createdBy !== updatedTask.assignedTo) {
          const creatorNotification = await createNotification(
            updatedTask.createdBy,
            statusMessage,
            updatedTask._id,
            'status_changed',
            userEmail
          );
          console.log("Creator notification created:", creatorNotification ? creatorNotification._id : "failed");
        }
        
        // Notify team members if applicable
        if (updatedTask.teamMembers && updatedTask.teamMembers.length > 0) {
          for (const member of updatedTask.teamMembers) {
            if (member !== userEmail && 
                member !== updatedTask.assignedTo && 
                member !== updatedTask.createdBy) {
              const memberNotification = await createNotification(
                member,
                `Team task "${updatedTask.title}" status changed from ${oldStatus} to ${newStatus}`,
                updatedTask._id,
                'status_changed',
                userEmail
              );
              console.log(`Team member ${member} notification:`, memberNotification ? memberNotification._id : "failed");
            }
          }
        }
      } else if (updatedFields.length > 0) {
        // For other updates
        console.log("Task updated with non-status changes");
        
        // Create notification message based on what was updated
        let updateMessage = `Task "${updatedTask.title}" has been updated`;
        if (updatedFields.includes('deadline')) {
          updateMessage = `Deadline updated for task "${updatedTask.title}"`;
        } else if (updatedFields.includes('priority')) {
          updateMessage = `Priority changed to ${updatedTask.priority} for task "${updatedTask.title}"`;
        } else if (updatedFields.includes('description')) {
          updateMessage = `Description updated for task "${updatedTask.title}"`;
        }
        
        // Create notification for assignee if they're not the updater
        if (updatedTask.assignedTo && updatedTask.assignedTo !== userEmail) {
          const assigneeNotification = await createNotification(
            updatedTask.assignedTo,
            updateMessage,
            updatedTask._id,
            'task_updated',
            userEmail
          );
          console.log("Assignee notification created:", assigneeNotification ? assigneeNotification._id : "failed");
        }
        
        // Create notification for creator if different from assignee and updater
        if (updatedTask.createdBy && 
            updatedTask.createdBy !== userEmail && 
            updatedTask.createdBy !== updatedTask.assignedTo) {
          const creatorNotification = await createNotification(
            updatedTask.createdBy,
            updateMessage,
            updatedTask._id,
            'task_updated',
            userEmail
          );
          console.log("Creator notification created:", creatorNotification ? creatorNotification._id : "failed");
        }
      }
    } catch (notificationError) {
      console.error("Error creating notifications:", notificationError);
      // Continue execution even if notification creation fails
    }
    
    res.status(200).json({ 
      message: "✅ Task updated successfully", 
      task: updatedTask,
      previousStatus: oldStatus
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "❌ Task not found" });
    }
    
    // Only admin can delete tasks
    if (userEmail !== "rockabhisheksingh778189@gmail.com") {
      return res.status(403).json({ message: "❌ You don't have permission to delete tasks" });
    }
    
    // Before deleting, capture information for notifications
    const taskTitle = task.title;
    const assignedTo = task.assignedTo;
    const createdBy = task.createdBy;
    const teamMembers = task.teamMembers || [];
    
    await Task.findByIdAndDelete(taskId);
    
    // Send notifications about deletion
    try {
      // Notify assignee if they're not the deleter
      if (assignedTo && assignedTo !== userEmail) {
        await createNotification(
          assignedTo,
          `Task "${taskTitle}" has been deleted`,
          null, // No task ID since it's deleted
          'task_deleted',
          userEmail
        );
      }
      
      // Notify creator if they're not the deleter or assignee
      if (createdBy && createdBy !== userEmail && createdBy !== assignedTo) {
        await createNotification(
          createdBy,
          `Task "${taskTitle}" has been deleted`,
          null,
          'task_deleted',
          userEmail
        );
      }
      
      // Notify team members if applicable
      if (teamMembers.length > 0) {
        for (const member of teamMembers) {
          if (member !== userEmail && member !== assignedTo && member !== createdBy) {
            await createNotification(
              member,
              `Team task "${taskTitle}" has been deleted`,
              null,
              'task_deleted',
              userEmail
            );
          }
        }
      }
    } catch (notificationError) {
      console.error("Error sending deletion notifications:", notificationError);
      // Continue execution even if notifications fail
    }
    
    res.status(200).json({ message: "✅ Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userEmail = req.query.email || req.body.userEmail;
    const { comment } = req.body;
    
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: "❌ Comment text is required" });
    }
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    console.log("Adding comment:", taskId, comment, "by:", userEmail);
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "❌ Task not found" });
    }
    
    // Check if user has permission to comment on this task
    if (userEmail !== "rockabhisheksingh778189@gmail.com" && task.assignedTo !== userEmail) {
      return res.status(403).json({ message: "❌ You don't have permission to comment on this task" });
    }
    
    // Create a comment object
    const commentObj = {
      text: comment.trim(),
      user: userEmail,
      date: new Date()
    };
    
    // Initialize comments array if it doesn't exist
    if (!task.comments) {
      task.comments = [];
    }
    
    task.comments.push(commentObj);
    await task.save();
    
    // Create notifications for relevant users
    try {
      // Notify task assignee if commenter is not assignee
      if (task.assignedTo !== userEmail) {
        await createNotification(
          task.assignedTo,
          `New comment on task "${task.title}"`,
          task._id,
          'comment_added',
          userEmail
        );
        console.log(`Comment notification sent to assignee: ${task.assignedTo}`);
      }
      
      // Notify task creator if different from assignee and commenter
      if (task.createdBy && 
          task.createdBy !== userEmail && 
          task.createdBy !== task.assignedTo) {
        await createNotification(
          task.createdBy,
          `New comment on task "${task.title}"`,
          task._id,
          'comment_added',
          userEmail
        );
        console.log(`Comment notification sent to creator: ${task.createdBy}`);
      }
      
      // If team task, notify other team members
      if (task.teamMembers && task.teamMembers.length > 0) {
        for (const member of task.teamMembers) {
          if (member !== userEmail && 
              member !== task.assignedTo && 
              member !== task.createdBy) {
            await createNotification(
              member,
              `New comment on team task "${task.title}"`,
              task._id,
              'comment_added',
              userEmail
            );
            console.log(`Comment notification sent to team member: ${member}`);
          }
        }
      }
    } catch (notificationError) {
      console.error("Error creating comment notifications:", notificationError);
      // Continue execution even if notifications fail
    }
    
    res.status(200).json({ message: "✅ Comment added successfully", task });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userEmail = req.query.email || req.body.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    console.log("Uploading file for task:", taskId);
    
    if (!req.file) {
      return res.status(400).json({ message: "❌ No file uploaded" });
    }
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "❌ Task not found" });
    }
    
    // Check if user has permission to upload file to this task
    if (userEmail !== "rockabhisheksingh778189@gmail.com" && task.assignedTo !== userEmail) {
      return res.status(403).json({ message: "❌ You don't have permission to upload files to this task" });
    }
    
    // Store file information
    task.file = req.file.filename;
    
    // Add a comment about the file upload
    const fileComment = {
      text: `Uploaded file: ${req.file.originalname}`,
      user: userEmail,
      date: new Date(),
      isFileUpload: true
    };
    
    if (!task.comments) {
      task.comments = [];
    }
    
    task.comments.push(fileComment);
    await task.save();
    
    // Create notifications for relevant users
    try {
      // Notify task assignee if uploader is not assignee
      if (task.assignedTo !== userEmail) {
        await createNotification(
          task.assignedTo,
          `New file uploaded to task "${task.title}"`,
          task._id,
          'file_uploaded',
          userEmail
        );
        console.log(`File upload notification sent to assignee: ${task.assignedTo}`);
      }
      
      // Notify task creator if different from assignee and uploader
      if (task.createdBy && 
          task.createdBy !== userEmail && 
          task.createdBy !== task.assignedTo) {
        await createNotification(
          task.createdBy,
          `New file uploaded to task "${task.title}"`,
          task._id,
          'file_uploaded',
          userEmail
        );
        console.log(`File upload notification sent to creator: ${task.createdBy}`);
      }
      
      // If team task, notify other team members
      if (task.teamMembers && task.teamMembers.length > 0) {
        for (const member of task.teamMembers) {
          if (member !== userEmail && 
              member !== task.assignedTo && 
              member !== task.createdBy) {
            await createNotification(
              member,
              `New file uploaded to team task "${task.title}"`,
              task._id,
              'file_uploaded',
              userEmail
            );
            console.log(`File upload notification sent to team member: ${member}`);
          }
        }
      }
    } catch (notificationError) {
      console.error("Error creating file upload notifications:", notificationError);
      // Continue execution even if notifications fail
    }
    
    res.status(200).json({ message: "✅ File uploaded successfully", task });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};

// New endpoint to get task statistics for dashboard
exports.getTaskStats = async (req, res) => {
  try {
    const userEmail = req.query.email;
    
    if (!userEmail) {
      return res.status(400).json({ message: "❌ User email is required" });
    }
    
    // Determine if user is admin
    const isAdmin = userEmail === "rockabhisheksingh778189@gmail.com";
    
    // Base query depends on user role
    const baseQuery = isAdmin ? {} : { assignedTo: userEmail };
    
    // Get counts by status
    const pendingCount = await Task.countDocuments({ ...baseQuery, status: "Pending" });
    const inProgressCount = await Task.countDocuments({ ...baseQuery, status: "In Progress" });
    const doneCount = await Task.countDocuments({ ...baseQuery, status: "Done" });
    
    // Get counts by priority
    const highPriorityCount = await Task.countDocuments({ ...baseQuery, priority: "High" });
    const mediumPriorityCount = await Task.countDocuments({ ...baseQuery, priority: "Medium" });
    const lowPriorityCount = await Task.countDocuments({ ...baseQuery, priority: "Low" });
    
    // Get upcoming deadlines (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingDeadlines = await Task.find({
      ...baseQuery,
      deadline: { $gte: today, $lte: nextWeek },
      status: { $ne: "Done" }
    }).sort({ deadline: 1 }).limit(5);
    
    res.status(200).json({
      statusCounts: {
        pending: pendingCount,
        inProgress: inProgressCount,
        done: doneCount,
        total: pendingCount + inProgressCount + doneCount
      },
      priorityCounts: {
        high: highPriorityCount,
        medium: mediumPriorityCount,
        low: lowPriorityCount
      },
      upcomingDeadlines
    });
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    res.status(500).json({ message: "❌ Server error", error: error.message });
  }
};