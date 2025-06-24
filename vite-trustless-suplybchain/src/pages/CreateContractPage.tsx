// src/pages/CreateContractPage.tsx
import { CreateContractForm } from '../components/CreateContractForm';
import type { ContractFormDataType } from '../lib/validators/contractValidator';
import { type SubmitHandler } from 'react-hook-form';

function CreateContractPage() {
  
  // This is where you define what happens on a successful submission
  const handleContractSubmit: SubmitHandler<ContractFormDataType> = (data) => {
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
    <div className="mt-8  ">
      <CreateContractForm onSubmit={handleContractSubmit} />
    </div>
  );
}
export default CreateContractPage;