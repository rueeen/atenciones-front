import React, { useState, useEffect } from "react";
import CrearEstudianteModal from "./CrearEstudianteModal";
import API from "../api";
import Swal from "sweetalert2";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

const PasoSeleccionEstudiante = ({ onSeleccionar }) => {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (busqueda.length >= 2) {
      API.get(`estudiantes/?search=${busqueda}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setResultados(res.data));
    } else {
      setResultados([]);
    }
  }, [busqueda]);

  const crearEstudiante = async () => {
    try {
      const resCarreras = await API.get("carreras/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const opcionesHTML = resCarreras.data
        .map((c) => `<option value="${c.id}">${c.nombre}</option>`)
        .join("");

      const { value: formValues } = await Swal.fire({
        title: "Nuevo Estudiante",
        html: `
        <input id="rut" class="swal2-input" placeholder="RUT">
        <input id="nombre" class="swal2-input" placeholder="Nombre completo">
        <input id="email" class="swal2-input" placeholder="Correo">
        <select id="carrera" class="swal2-input">${opcionesHTML}</select>
      `,
        focusConfirm: false,
        preConfirm: () => {
          return {
            rut: document.getElementById("rut").value,
            nombre: document.getElementById("nombre").value,
            correo: document.getElementById("email").value,
            carrera: document.getElementById("carrera").value,
          };
        },
      });

      if (formValues) {
        const res = await API.post("estudiantes/", formValues, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Estudiante creado", "", "success");
        onSeleccionar(res.data);
      }
    } catch (err) {
      Swal.fire("Error al crear estudiante", "", "error");
    }
  };

  return (
    <div>
      <h4>Paso 1: Seleccionar o crear estudiante</h4>
      <Form>
        <FormGroup>
          <Label>Buscar por nombre o RUT:</Label>
          <Input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej. 12.345.678-9 o Juan Pérez"
          />
        </FormGroup>
      </Form>

      <ListGroup>
        {resultados.map((est) => (
          <ListGroupItem
            key={est.id}
            onClick={() => onSeleccionar(est)}
            style={{ cursor: "pointer" }}
          >
            {est.nombre} - {est.rut}
          </ListGroupItem>
        ))}
      </ListGroup>

      <Button
        color="success"
        className="mt-3"
        onClick={() => setMostrarModal(true)}
      >
        Crear nuevo estudiante
      </Button>

      <CrearEstudianteModal
        isOpen={mostrarModal}
        toggle={() => setMostrarModal(false)}
        onCreado={(nuevo) => {
          setMostrarModal(false);
          Swal.fire("Estudiante creado", "", "success");
          onSeleccionar(nuevo);
        }}
      />
    </div>
  );
};

export default PasoSeleccionEstudiante;
