import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import api from "../services/api";
import { Task } from "../types";
import { useTheme } from "styled-components";

const KanbanPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [taskStatus, setTaskStatus] = useState<"to-do" | "in-progress" | "done">("to-do");
  const [dueDate, setDueDate] = useState<string>("");
  const theme = useTheme();

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
          },
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
  const moveTask = async (taskId: string, newStatus: "to-do" | "in-progress" | "done") => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para mover a tarefa.");
      return;
    }

    try {
      // Atualiza o status da tarefa no backend
      await api.put(
        `api/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
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

  // Componente de item de tarefa (Draggable)
  const TaskItem = ({ task }: { task: Task }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "TASK",
      item: { id: task._id, status: task.status },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        style={{
          padding: "10px",
          margin: "10px 0",
          backgroundColor: theme.cardBackground,
          border: `1px solid ${theme.borderColor}`,
          borderRadius: "5px",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        {task.title}
      </div>
    );
  };

  // Componente de área de drop (Droppable)
  const TaskColumn = ({ status }: { status: "to-do" | "in-progress" | "done" }) => {
    const [, drop] = useDrop(() => ({
      accept: "TASK",
      drop: (item: any) => {
        moveTask(item.id, status);
      },
    }));

    return (
      <div
        ref={drop}
        style={{
          width: "30%",
          padding: "10px",
          backgroundColor: theme.secondaryColor,
          borderRadius: "5px",
          border: `1px solid ${theme.borderColor}`,
          minHeight: "300px",
        }}
      >
        <h3
          style={{
            marginBottom: "10px",
            backgroundColor: theme.background,
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

        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
      </div>
    );
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <TaskColumn status="to-do" />
        <TaskColumn status="in-progress" />
        <TaskColumn status="done" />
      </div>
    </div>
  );
};

export default KanbanPage;
