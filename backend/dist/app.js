"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = __importDefault(require("./config"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes")); // Importando as rotas de tarefa
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Importando as rotas de autenticação
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
(0, config_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://localhost:3001' })); // Permite requisições da origem http://localhost:3001
app.use(express_1.default.json()); // Permite o uso de JSON no corpo da requisição
// Usando as rotas
app.use("/api/auth", authRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default); // Rota para tarefas
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
