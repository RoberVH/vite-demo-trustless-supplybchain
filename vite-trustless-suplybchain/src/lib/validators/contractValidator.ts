// src/lib/validators/productValidator.ts
import * as v from 'valibot';

// This is a mapping for the document selector for display purposes.
// It's not part of the validation schema itself but is related.
export const documentTypes: { [key: number]: string } = {
  1: 'Factura',
  2: 'Certificado de Analisis',
  3: 'Certificado de Origen',
  4: 'Conocimiento de Embarque'
};

// Custom validation function to check for max two decimal places
const isCurrency = (input: number) => {
    const decimals = (input.toString().split('.')[1] || '').length;
    return decimals <= 2;
};

// Define the validation schema using Valibot
export const ContractSchema = v.object({
  unit: v.pipe(
    v.number('Debe ser un número.'),
    v.integer('Debe ser un número entero.'),
    v.minValue(0, 'Debe ser 0 o un valor positivo.')
  ),
  unitPrice: v.pipe(
    v.number('Debe ser un número.'),
    v.minValue(0.01, 'El precio no puede ser cero.'),
    v.check((input)=> isCurrency(input), 'El precio no puede tener más de dos decimales.')
  ),
  // The date from the input is a string, so we coerce it to a Date object first
date: v.pipe(
    v.union([v.string(), v.number(),  v.date()]), 
    v.transform((input) => new Date(input)), 
    v.date('El valor debe ser una fecha válida.'), // Valida que sea una fecha válida
    v.check((val) => { // Usa v.check() en lugar de v.custom()
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const inputDate = new Date(val);
      inputDate.setHours(0, 0, 0, 0);
      return inputDate.getTime() > today.getTime(); // Cambiado a > para "mayor que hoy"
    }, 'La fecha debe ser mayor a la de hoy.')
  ),
  description: v.optional(v.string(), ''), // Optional string, defaults to ''
    lote: v.optional(v.string(), ''),       // Optional string, defaults to ''
    documents: v.optional(
        v.array(
        v.pipe(
            v.number(),
            // Ensure the numbers in the array are one of the allowed keys
            v.custom((val) => Object.keys(documentTypes).map(Number).includes(val as number))
        )
        ),
        [] // Default value is an empty array
  ),
});

// Infer the TypeScript type directly from the schema
// This is extremely useful for type safety in our form and submit handler
export type ContractFormDataType = v.InferInput<typeof ContractSchema>; 