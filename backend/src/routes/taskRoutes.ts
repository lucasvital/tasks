import express from "express";
import { protect } from "../middleware/authMiddleware"; // Middleware de autenticação
import * as taskController from "../controllers/taskController";
import { updateTaskStatus } from "../controllers/taskController";

const router = express.Router();

router.get("/", protect, taskController.getTasks); // Rota protegida
router.post("/", protect, taskController.createTask); // Rota protegida
router.delete("/:id", protect, taskController.deleteTask); // Rota protegida
router.put("/:id", updateTaskStatus); // Rota PUT para atualizar a tarefa

export default router;
