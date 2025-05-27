import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Select from 'react-select';
import API from '../api';

const CrearEstudianteModal = ({ isOpen, toggle, onCreado }) => {
  const [form, setForm] = useState({
    rut: '',
    nombre: '',
    correo: '',
    carrera: null,
  });
  const [carreras, setCarreras] = useState([]);

  const token = localStorage.getItem('access');

  useEffect(() => {
    if (isOpen) {
      API.get('carreras/', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        setCarreras(res.data.map(c => ({ value: c.id, label: c.nombre })));
      });
    }
  }, [isOpen, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const nuevo = {
        rut: form.rut,
        nombre: form.nombre,
        correo: form.correo,
        carrera: form.carrera.value,
      };
      const res = await API.post('estudiantes/', nuevo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onCreado(res.data); // pasa el nuevo estudiante al padre
      toggle(); // cierra modal
    } catch (err) {
      alert('Error al crear estudiante');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Nuevo Estudiante</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="rut">RUT</Label>
            <Input name="rut" onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="nombre">Nombre completo</Label>
            <Input name="nombre" onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="correo">Correo</Label>
            <Input type="email" name="correo" onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="carrera">Carrera</Label>
            <Select
              options={carreras}
              value={form.carrera}
              onChange={(op) => setForm({ ...form, carrera: op })}
              placeholder="Buscar carrera..."
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>Crear</Button>
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default CrearEstudianteModal;
