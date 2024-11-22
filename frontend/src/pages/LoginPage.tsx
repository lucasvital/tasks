import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import api from "../services/api";  // Importe a configuração da API

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Fazendo a requisição para o backend para fazer o login
      const response = await api.post("api/auth/login", { email, password });
      
      // Armazenando o token no localStorage ou cookie
      localStorage.setItem("token", response.data.token);
      
      // Redirecionando para a página do Kanban após o login
      navigate("/kanban");
    } catch (err: any) {
      setError(err.response?.data?.error || "Credenciais inválidas.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Entrar</Button>
        <LinkContainer>
          <Link href="/register">Não tem uma conta? Cadastre-se</Link>
        </LinkContainer>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.background};
  padding: 0 20px;
`;

const Form = styled.form`
  background-color: ${(props) => props.theme.background};
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.primaryColor};
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
  outline: none;
  &:focus {
    border-color: ${(props) => props.theme.primaryColor};
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.primaryColor};
  color: white;
  border: none;
  padding: 15px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${(props) => props.theme.primaryColor};
    opacity: 0.9;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
  font-size: 14px;
`;

const LinkContainer = styled.div`
  margin-top: 20px;
`;

const Link = styled.a`
  color: ${(props) => props.theme.primaryColor};
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

export default LoginPage;
