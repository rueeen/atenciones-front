import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import API from "../api";
import { mostrarAlerta, mostrarErroresAPI } from "../utils/alerta";

const CrearUsuarioForm = () => {
  const [datos, setDatos] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    perfil: "funcionario",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("usuarios/crear/", datos, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      mostrarAlerta(
        "¡Usuario creado!",
        "El nuevo usuario fue registrado con éxito."
      );
    } catch (err) {
      if (err.response?.data) {
        mostrarErroresAPI(err.response.data);
      } else {
        mostrarAlerta("Error", "No se pudo crear el usuario.", "error");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {mensaje && <Alert>{mensaje}</Alert>}
      <FormGroup>
        <Label>Username</Label>
        <Input type="text" name="username" onChange={handleChange} required />
      </FormGroup>
      <FormGroup>
        <Label>Nombre</Label>
        <Input type="text" name="first_name" onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Apellido</Label>
        <Input type="text" name="last_name" onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Email</Label>
        <Input type="email" name="email" onChange={handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Contraseña</Label>
        <Input
          type="password"
          name="password"
          onChange={handleChange}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label>Perfil</Label>
        <Input type="select" name="perfil" onChange={handleChange}>
          <option value="funcionario">Funcionario</option>
          <option value="administrador">Administrador</option>
        </Input>
      </FormGroup>
      <Button color="primary">Crear Usuario</Button>
    </Form>
  );
};

export default CrearUsuarioForm;
