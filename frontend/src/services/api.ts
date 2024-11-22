import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // URL do seu backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Recupera o token do localStorage
  if (token) {
    console.log("Token no request:", token); // Adicione um log para verificar o token
    config.headers.Authorization = `Bearer ${token}`; // Adiciona o token no cabeçalho
  }
  return config;
});

export default api;
