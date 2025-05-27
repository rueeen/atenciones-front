import React, { useEffect, useState } from 'react';
import API from '../api';

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem('access');
      try {
        const res = await API.get('me/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuario(res.data);
      } catch (error) {
        console.error("No se pudo obtener el perfil", error);
      }
    };

    fetchUsuario();
  }, []);

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>Perfil de usuario</h2>
      <p><strong>Usuario:</strong> {usuario.username}</p>
      <p><strong>Nombre:</strong> {usuario.first_name} {usuario.last_name}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Perfil:</strong> {usuario.perfil}</p>
    </div>
  );
};

export default Perfil;
