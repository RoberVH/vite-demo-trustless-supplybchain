/**
 * Type definitions for the Trustless SupplylChain demo app.
 */

/**
 * Represents a user in the system.
 */
// export interface User {
//   id: number;
//   name: string;
//   role: string;
// }

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



export interface LocalUser {
  id:number;
  name: string;
  role: string;
  privateKey: string;
}
