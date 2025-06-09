/**
 * Type definitions for the Trustless SupplylChain demo app.
 */

/**
 * Represents a user in the system.
 */
export interface User {
  id: number;
  name: string;
}

/**
 * Represents a location entry for delivery.
 */
export interface Location {
  idLocal: number;
  descripcion: string;
}

/**
 * Represents a document type required.
 */
export interface Document {
  idDoc: number;
  descripcion: string;
}

/**
 * Shape of the contract form data.
 */
export interface ContractFormData {
  contractId: string;
  creationDate: string;
  description: string;
  units: number;
  lote: string;
  unitPrice: number;
  maxDeliveryDate: string;
  realDeliveryDate: string;
  minDaysValidity: number;
  locationDelivery: number; // idLocal
  requiredDocuments: number[]; // array of idDoc
}
