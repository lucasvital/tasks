import { Request, Response } from "express";
import { Task } from "../models/Task";
import { ITask } from "../models/Task";
import { IUser } from "../models/User";
import { Types } from "mongoose"; // Importa o módulo Types do Mongoose
import { sendNotification } from "../utils/notifications";


export const getTasks = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const userId = req.user.id;
    console.log("userId recebido no backend:", userId);

    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, status, dueDate } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const newTask = await Task.create({
      title,
      status,
      dueDate,
      userId: new Types.ObjectId(req.user.id), // Certifique-se de que o `userId` está em ObjectId
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
};


export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deletedTask) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    res.json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
};


export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar a tarefa" });
  }
};
