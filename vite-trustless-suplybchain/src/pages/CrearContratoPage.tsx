import React from "react";
import CreateContractForm from "../components/CreateContractForm";

/**
 * Página que expone el formulario de “Crear Contrato”.
 */
const CrearContratoPage: React.FC = () => {
  return (
    <div className="p-6">
      <CreateContractForm />
    </div>
  );
};

export default CrearContratoPage;
