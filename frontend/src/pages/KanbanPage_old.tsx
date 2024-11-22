import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../services/api";
import { Task } from "../types"; // Importação do tipo de tarefa
import { useTheme } from "styled-components"; // Importar hook para acessar o tema

const KanbanPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>(""); // Título da nova tarefa
  const [taskStatus, setTaskStatus] = useState<"to-do" | "in-progress" | "done">("to-do"); // Status da tarefa
  const [dueDate, setDueDate] = useState<string>(""); // Data de vencimento da tarefa
  const theme = useTheme(); // Acessar o tema atual

  // Função para buscar as tarefas do backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Você precisa estar logado para acessar as tarefas.");
          return;
        }

        const response = await api.get("api/tasks", {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas", error);
      }
    };

    fetchTasks();
  }, []);

  // Função para adicionar uma nova tarefa
  const addTask = async () => {
    if (newTaskTitle.trim() && dueDate) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para criar uma tarefa.");
        return;
      }

      try {
        const newTask = {
          title: newTaskTitle,
          status: taskStatus,
          dueDate: dueDate,
        };
        const response = await api.post(
          "api/tasks",
          newTask,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        setTasks([...tasks, response.data]);
        setNewTaskTitle(""); // Limpa o campo após adicionar
        setDueDate(""); // Limpa o campo de data
      } catch (error) {
        console.error("Erro ao adicionar tarefa", error);
      }
    } else {
      alert("Por favor, insira um título e uma data para a tarefa.");
    }
  };

  // Função para gerenciar o fim do arraste (drag-and-drop)
  const handleDragEnd = async (result: any) => {
    const { destination, source } = result;

    if (!destination) return; // Se o destino for nulo, não faça nada

    const taskId = tasks[source.index]._id; // Identificar a tarefa pelo ID
    const newStatus = destination.droppableId as "to-do" | "in-progress" | "done";

    try {
      const token = localStorage.getItem("token"); // Obter o token do localStorage
      if (!token) {
        alert("Você precisa estar logado para mover a tarefa.");
        return;
      }

      // Atualiza o status da tarefa no backend
      await api.put(
        `api/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            "Authorization": `Bearer ${token}`, // Enviar o token no cabeçalho
          },
        }
      );

      // Atualiza a lista de tarefas localmente
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );

      // Agrupar as tarefas por status (preservando a ordem)
      const tasksByStatus = updatedTasks.reduce((acc: any, task: Task) => {
        acc[task.status] = acc[task.status] || [];
        acc[task.status].push(task);
        return acc;
      }, {});

      // Recria o estado das tarefas agrupado por status
      const reorderedTasks = [
        ...tasksByStatus["to-do"] || [],
        ...tasksByStatus["in-progress"] || [],
        ...tasksByStatus["done"] || []
      ];

      setTasks(reorderedTasks); // Atualiza o estado com a nova lista
    } catch (error) {
      console.error("Erro ao mover tarefa", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Kanban</h2>

      {/* Formulário para adicionar nova tarefa */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nova tarefa"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            width: "250px",
          }}
        />
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value as "to-do" | "in-progress" | "done")}
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        >
          <option value="to-do">A Fazer</option>
          <option value="in-progress">Em Andamento</option>
          <option value="done">Concluídas</option>
        </select>

        {/* Campo de data para a tarefa */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />

        <button onClick={addTask} style={{ padding: "10px 20px", cursor: "pointer", borderRadius: "5px" }}>
          Adicionar Tarefa
        </button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {["to-do", "in-progress", "done"].map((status) => (
            <div
              key={status}
              style={{
                width: "30%",
                padding: "10px",
                backgroundColor: theme.secondaryColor, // Usando o secondaryColor do tema
                borderRadius: "5px",
                border: `1px solid ${theme.borderColor}`, // Usando borderColor do tema
                minHeight: "300px", // Garantir que o droppable tenha uma altura mínima
              }}
            >
              {/* Título da Coluna Fora da Área de Tarefas */}
              <h3
                style={{
                  marginBottom: "10px",
                  backgroundColor: theme.background, // Usando o background do tema
                  padding: "5px",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                {status === "to-do"
                  ? "A Fazer"
                  : status === "in-progress"
                  ? "Em Andamento"
                  : "Concluídas"}
              </h3>

              {/* Kanban Column Tarefas */}
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      minHeight: "200px",  // Área de tarefas dentro da coluna
                    }}
                  >
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                padding: "10px",
                                margin: "10px 0",
                                backgroundColor: theme.cardBackground, // Usando cardBackground do tema
                                border: `1px solid ${theme.borderColor}`, // Usando borderColor do tema
                                borderRadius: "5px",
                              }}
                            >
                              {task.title}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanPage;
