import React, { useState } from 'react';
import PasoSeleccionEstudiante from './PasoSeleccionEstudiante';
import PasoRegistroAtencion from './PasoRegistroAtencion';

const FormularioAtencionWizard = () => {
  const [paso, setPaso] = useState(1);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);

  const avanzar = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setPaso(2);
  };

  return (
    <div>
      {paso === 1 && <PasoSeleccionEstudiante onSeleccionar={avanzar} />}
      {paso === 2 && <PasoRegistroAtencion estudiante={estudianteSeleccionado} />}
    </div>
  );
};

export default FormularioAtencionWizard;
