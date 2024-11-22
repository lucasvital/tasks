import express from "express";
import dotenv from "dotenv";
import connectDB from "./config";
import taskRoutes from "./routes/taskRoutes"; // Importando as rotas de tarefa
import authRoutes from "./routes/authRoutes"; // Importando as rotas de autenticação
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: 'http://localhost:3001' })); // Permite requisições da origem http://localhost:3001
app.use(express.json()); // Permite o uso de JSON no corpo da requisição

// Usando as rotas
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes); // Rota para tarefas

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
