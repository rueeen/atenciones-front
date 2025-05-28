import React, { useEffect, useState } from "react";
import API from "../api";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Swal from "sweetalert2";

const AtencionList = () => {
  const [atenciones, setAtenciones] = useState([]);
  const [modal, setModal] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [atencionSeleccionada, setAtencionSeleccionada] = useState(null);
  const [nuevoUsuarioId, setNuevoUsuarioId] = useState("");

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchAtenciones();
  }, []);

  const fetchAtenciones = async () => {
    const res = await API.get("atenciones/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAtenciones(res.data);
  };

  const abrirModalTraslado = async (atencionId) => {
    setAtencionSeleccionada(atencionId);
    const res = await API.get("usuarios/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsuarios(res.data);
    setModal(true);
  };

  const realizarTraslado = async () => {
    try {
      await API.post(
        `atenciones/${atencionSeleccionada}/trasladar/`,
        { usuario: parseInt(nuevoUsuarioId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModal(false);
      Swal.fire("Traslado realizado", "", "success");
      fetchAtenciones();
    } catch (error) {
      Swal.fire("Error", "No se pudo trasladar la atención", "error");
    }
  };

  return (
    <div>
      <h3>Atenciones</h3>
      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Estudiante</th>
            <th>Motivo</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {atenciones.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.estudiante}</td>
              <td>{a.motivo}</td>
              <td>{a.fecha_creacion}</td>
              <td>
                <Button
                  color="warning"
                  size="sm"
                  onClick={() => abrirModalTraslado(a.id)}
                >
                  Trasladar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de traslado */}
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          Trasladar atención
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="usuario">Nuevo encargado</Label>
            <Input
              type="select"
              id="usuario"
              value={nuevoUsuarioId}
              onChange={(e) => setNuevoUsuarioId(e.target.value)}
            >
              <option value="">Seleccione un usuario</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name} ({u.username})
                </option>
              ))}
            </Input>
          </FormGroup>
          <Button color="primary" onClick={realizarTraslado}>
            Confirmar traslado
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AtencionList;
