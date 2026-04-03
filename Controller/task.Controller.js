import { userModel } from "../Model/auth.Model.js";
import { taskModel } from "../Model/task.Model.js";

export const addTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            assignTo,
            status,
            dueDate,
            createdAt,
            updatedAt,
            completedAt,
            comments
        } = req.body;

        const lastTask = await taskModel.findOne().sort({ taskId: -1 });
        const newTaskId = lastTask ? lastTask.taskId + 1 : 1;

        const currentUser = await userModel.findOne({ userId: req.user.userId });
        let assignedUserRef = currentUser ? currentUser._id : null;

        if (assignTo) {
            const assignedUser = await userModel.findOne({ userId: assignTo });

            if (assignedUser) {
                assignedUserRef = assignedUser._id;
            }
        }

        const addNewTask = new taskModel({
            taskId: newTaskId,
            title,
            description,
            priority,
            assignTo: assignedUserRef,
            status,
            dueDate,
            createdBy: req.user.userId,
            createdAt,
            updatedAt,
            completedAt,
            comments
        });

        await addNewTask.save();
        res.status(201).json({
            message: "Task added successfully",
            data: addNewTask
        });
    } catch (error) {
        console.log("Error in adding task", error);
        res.status(500).json({
            message: error.message
        })
    }
}

export const getTask = async (req, res) => {
    try {
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await taskModel
                .find()
                .populate('assignTo', 'userId name -_id');
        } else {
            const currentUser = await userModel.findOne({ userId: req.user.userId });
            const assignedRef = currentUser ? currentUser._id : null;

            tasks = await taskModel
                .find(assignedRef ? { assignTo: assignedRef } : {})
                .populate('assignTo', 'userId name -_id');
        }

        if (!tasks || tasks.length === 0) {
            return res.status(200).json({
                message: "Tasks retrieved successfully",
                data: []
            });
        }

        res.status(200).json({
            message: "Tasks retrieved successfully",
            data: tasks
        });
    } catch (error) {
        console.log("Error in getting task", error);
        res.status(500).json({
            message: error.message
        })
    }
}

export const getTaskById = async (req, res) => {
    try {
        const taskId = isNaN(Number(req.params.taskId)) ? req.params.taskId : Number(req.params.taskId);
        const task = await taskModel.findOne({ taskId });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        // Non-admin can only see tasks assigned to them or created by them
        if (req.user.role !== 'admin') {
            const userId = req.user.userId;
            const isAssigned = task.assignTo === userId || task.assignTo === Number(userId);
            const isCreator = task.createdBy === userId || task.createdBy === Number(userId) || String(task.createdBy) === String(userId);
            if (!isAssigned && !isCreator) {
                return res.status(403).json({
                    message: "Access denied. You can only view your own tasks."
                });
            }
        }

        res.status(200).json({
            success: true,
            data: task
        })
    } catch (error) {
        console.log("Error in getting task by ID", error);
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateTask = async (req, res) => {
    try {
        const updatedTask = await taskModel.findOneAndUpdate(
            { taskId: Number(req.params.taskId) },
            req.body,
            { returnDocument: "after" }
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            data: updatedTask
        });
    } catch (error) {
        console.log("Error in updating task", error);
        res.status(500).json({
            message: error.message
        })
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await taskModel.findOneAndDelete({ taskId: Number(req.params.taskId) });

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully",
            data: deletedTask
        });
    } catch (error) {
        console.log("Error in deleting task", error);
        res.status(500).json({
            message: error.message
        })
    }
}

export const getUser = async (req, res) => {
    try {
        const employees = await userModel.find(
            { role: "employee" },
            { userId: 1, name: 1 }
        );

        if (!employees) {
            return res.status(404).json({
                message: "No employees found"
            });
        }

        res.status(200).json({
            message: "Employees retrieved successfully",
            data: employees
        })
    } catch (error) {
        console.log("Error in getting user", error);
        res.status(500).json({
            message: error.message
        })
    }
}