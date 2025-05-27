import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('login/', { username, password });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      onLogin(); // ✅ notifica a App que el usuario está logueado
      navigate('/atenciones'); // 🔁 redirige
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert color="danger">{error}</Alert>}
      <FormGroup>
        <Label for="username">Usuario</Label>
        <Input
          type="text"
          name="username"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Contraseña</Label>
        <Input
          type="password"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormGroup>
      <Button color="primary">Iniciar sesión</Button>
    </Form>
  );
};

export default LoginForm;
