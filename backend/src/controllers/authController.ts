import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Task } from "../models/Task";


const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "defaultSecret", { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  
  try {
    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(password, 10); // O número 10 é a "salting rounds", você pode ajustar para mais para aumentar a segurança.

    // Criando o usuário com a senha criptografada
    const user = await User.create({ username, email, password: hashedPassword });
    
    res.status(201).json({
      message: "Registro bem-sucedido!",
      token: generateToken(user._id),
    });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: "Erro ao registrar: " + error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Buscando o usuário no banco de dados
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Comparando a senha com o hash no banco
    const isMatch = await bcrypt.compare(password, user.password);
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // O novo status enviado no corpo da requisição

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Tarefa não encontrada" });
    }

    task.status = status; // Atualiza o status da tarefa
    await task.save();

    res.status(200).json(task); // Retorna a tarefa atualizada
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar a tarefa" });
  }
};