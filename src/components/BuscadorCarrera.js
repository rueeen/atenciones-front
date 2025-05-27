import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import API from '../api';

const BuscadorCarrera = ({ onSeleccion }) => {
  const token = localStorage.getItem('access');

  const cargarOpciones = async (inputValue, callback) => {
    try {
      const res = await API.get(`carreras/?search=${inputValue}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const opciones = res.data.map((carrera) => ({
        value: carrera.id,
        label: carrera.nombre,
      }));

      callback(opciones);
    } catch (err) {
      callback([]);
    }
  };

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={cargarOpciones}
      defaultOptions
      onChange={(opcion) => onSeleccion(opcion)}
      placeholder="Buscar carrera..."
    />
  );
};

export default BuscadorCarrera;
