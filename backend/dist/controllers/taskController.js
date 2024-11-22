"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.deleteTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = require("../models/Task");
const mongoose_1 = require("mongoose"); // Importa o módulo Types do Mongoose
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        const userId = req.user.id;
        console.log("userId recebido no backend:", userId);
        const tasks = yield Task_1.Task.find({ userId });
        res.json(tasks);
    }
    catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        res.status(500).json({ error: "Erro ao buscar tarefas" });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, status, dueDate } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }
        const newTask = yield Task_1.Task.create({
            title,
            status,
            dueDate,
            userId: new mongoose_1.Types.ObjectId(req.user.id), // Certifique-se de que o `userId` está em ObjectId
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error("Erro ao criar tarefa:", error);
        res.status(500).json({ error: "Erro ao criar tarefa" });
    }
});
exports.createTask = createTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }
        const deletedTask = yield Task_1.Task.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!deletedTask) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }
        res.json({ message: "Tarefa deletada com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao deletar tarefa" });
    }
});
exports.deleteTask = deleteTask;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const task = yield Task_1.Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }
        task.status = status;
        yield task.save();
        res.status(200).json(task);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar a tarefa" });
    }
});
exports.updateTaskStatus = updateTaskStatus;
