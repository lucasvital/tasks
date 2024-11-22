import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { FaMoon, FaSun } from "react-icons/fa"; // Importando os ícones de Lua e Sol
import { DndProvider } from "react-dnd"; // Importando o DndProvider
import { HTML5Backend } from "react-dnd-html5-backend"; // Backend HTML5 para drag-and-drop
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import KanbanPage from "./pages/KanbanPage";
import { lightTheme, darkTheme } from "./themes";
import GlobalStyle from "./styles/globalStyle";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Função para alternar entre os temas
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <div>
        {/* Ícone de alternância de tema */}
        <button 
          onClick={toggleTheme} 
          style={{
            background: "transparent", 
            border: "none", 
            cursor: "pointer", 
            padding: "10px", 
            margin: "20px", 
            fontSize: "24px"
          }}
        >
          {isDarkMode ? <FaSun color="#f39c12" /> : <FaMoon color="#34495e" />}
        </button>

        {/* DndProvider envolvendo a parte da aplicação que utiliza drag-and-drop */}
        <DndProvider backend={HTML5Backend}>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
            </Routes>
          </Router>
        </DndProvider>
      </div>
    </ThemeProvider>
  );
};

export default App;
