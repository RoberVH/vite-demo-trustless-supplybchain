// src/pages/CreateContractPage.tsx
import { CreateContractForm } from '../components/CreateContractForm';
import type { ContractFormDataType } from '../lib/validators/contractValidator';
import { type SubmitHandler } from 'react-hook-form';

function CreateContractPage() {
  
  // This is where you define what happens on a successful submission
  const handleProductSubmit: SubmitHandler<ContractFormDataType> = (data) => {
    // The 'data' object is fully validated and typed according to your Valibot schema
    console.log('SUCCESS:', data);
    
    // Here you would typically send the data to your API
    // fetch('/api/products', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    
    alert('¡Producto guardado! Revisa la consola para ver los datos.');
  };

  return (
    <div className="container mx-auto py-10 ">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">Crear Nuevo Contrato Compra</h1>
      {/* The ProductForm component is clean. It doesn't know what will happen
        with the data. It only knows it needs to collect it, validate it,
        and pass it up to its parent via the onSubmit prop.
      */}
      <CreateContractForm onSubmit={handleProductSubmit} />
    </div>
  );
}
export default CreateContractPage;