import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../services/api";

const RegisterPage: React.FC = () => {
  const[username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("api/auth/register", { username, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao criar conta.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleRegister}>
        <Title>Cadastro</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="name"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
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
        <Button type="submit">Registrar</Button>
        <LinkContainer>
          <Link href="/login">Já tem uma conta? Faça login</Link>
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

export default RegisterPage;
