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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskStatus = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Task_1 = require("../models/Task");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || "defaultSecret", { expiresIn: "7d" });
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Criptografando a senha
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10); // O número 10 é a "salting rounds", você pode ajustar para mais para aumentar a segurança.
        // Criando o usuário com a senha criptografada
        const user = yield User_1.User.create({ username, email, password: hashedPassword });
        res.status(201).json({
            message: "Registro bem-sucedido!",
            token: generateToken(user._id),
        });
    }
    catch (err) {
        const error = err;
        res.status(400).json({ error: "Erro ao registrar: " + error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Buscando o usuário no banco de dados
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        // Comparando a senha com o hash no banco
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        // Gerando o token
        const token = generateToken(user._id);
        // Respondendo com o token
        res.status(200).json({
            message: "Login bem-sucedido!",
            token,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
});
exports.login = login;
const updateTaskStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body; // O novo status enviado no corpo da requisição
    try {
        const task = yield Task_1.Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }
        task.status = status; // Atualiza o status da tarefa
        yield task.save();
        res.status(200).json(task); // Retorna a tarefa atualizada
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar a tarefa" });
    }
});
exports.updateTaskStatus = updateTaskStatus;
