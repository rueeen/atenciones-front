import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavItem, NavLink, Button, NavbarBrand } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const AppNavbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      API.get('me/', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setIsAdmin(res.data.is_superuser);
          setNombreUsuario(res.data.first_name || res.data.username);
        })
        .catch(() => {
          setIsAdmin(false);
          setNombreUsuario('');
        });
    }
  }, []);

  const cerrarSesion = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Navbar color="light" light expand="md" className="mb-4 justify-content-between">
      <div className="d-flex align-items-center">
        <NavbarBrand href="/">Sistema de Atenciones</NavbarBrand>
        <Nav navbar>
          <NavItem>
            <NavLink href="/atenciones">Atenciones</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/atencion/nueva">Registrar Atención</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/perfil">Perfil</NavLink>
          </NavItem>
          {isAdmin && (
            <NavItem>
              <NavLink href="/usuarios/nuevo">Crear Usuario</NavLink>
            </NavItem>
          )}
        </Nav>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="me-3 text-muted">Hola, {nombreUsuario}</span>
        <Button color="danger" onClick={cerrarSesion}>Cerrar sesión</Button>
      </div>
    </Navbar>
  );
};

export default AppNavbar;
