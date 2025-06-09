import React, { useContext, useEffect, useState } from "react";
import type { ContractFormData, Location, Document } from "../types";
import { UserContext } from "../context/UserContext";


/**
 * Component for “Crear Contrato”. Contiene el formulario con todos los campos requeridos.
 */
const CreateContractForm: React.FC = () => {
  const { currentUser } = useContext(UserContext);

  // Estados locales para datos de catálogos
  const [locations, setLocations] = useState<Location[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Estado del formulario
  const [formData, setFormData] = useState<ContractFormData>({
    contractId: "",
    creationDate: "",
    description: "",
    units: 0,
    lote: "",
    unitPrice: 0,
    maxDeliveryDate: "",
    realDeliveryDate: "",
    minDaysValidity: 0,
    locationDelivery: 0,
    requiredDocuments: []
  });

  // Estado temporal para documento a agregar
  const [selectedDocId, setSelectedDocId] = useState<number>(0);

  // Cargar datos de JSON estáticos al inicio
  useEffect(() => {
    import("../data/locations.json").then((mod) => {
      setLocations(mod.default);
      // Default al primer idLocal
      if (mod.default.length > 0) {
        setFormData((prev) => ({
          ...prev,
          locationDelivery: mod.default[0].idLocal
        }));
      }
    });
    import("../data/documents.json").then((mod) => {
      setDocuments(mod.default);
      // Default al primer idDoc
      if (mod.default.length > 0) {
        setSelectedDocId(mod.default[0].idDoc);
      }
    });
  }, []);

  /**
   * Handler para cambiar cualquier campo del formulario.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        e.target.type === "number"
          ? Number(value)
          : value // los dates y strings quedan como string
    }));
  };

  /**
   * Agrega un documento a la lista de documentos requeridos,
   * evitando duplicados.
   */
  const handleAddDocument = () => {
    setFormData((prev) => {
      if (!prev.requiredDocuments.includes(selectedDocId)) {
        return {
          ...prev,
          requiredDocuments: [...prev.requiredDocuments, selectedDocId]
        };
      }
      return prev;
    });
  };

  /**
   * Elimina un documento de la lista.
   */
  const handleRemoveDocument = (idDoc: number) => {
    setFormData((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((d) => d !== idDoc)
    }));
  };

  /**
   * Limpia todos los campos del formulario.
   */
  const handleClear = () => {
    setFormData({
      contractId: "",
      creationDate: "",
      description: "",
      units: 0,
      lote: "",
      unitPrice: 0,
      maxDeliveryDate: "",
      realDeliveryDate: "",
      minDaysValidity: 0,
      locationDelivery: locations.length > 0 ? locations[0].idLocal : 0,
      requiredDocuments: []
    });
    if (documents.length > 0) {
      setSelectedDocId(documents[0].idDoc);
    }
  };

  /**
   * Simula la creación del contrato (por ahora hace console.log).
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating contract with data:", formData, "by user:", currentUser);
    // Aquí iría la lógica para enviar datos a backend / blockchain.
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-4 ">
      <h2 className="text-xl font-semibold mb-4">Crear Contrato</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contract ID */}
        <div>
          <label htmlFor="contractId" className="block font-normal ">
            ID del Contrato
          </label>
          <input
            type="text"
            id="contractId"
            name="contractId"
            value={formData.contractId}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Creation Date */}
        <div>
          <label htmlFor="creationDate" className="block font-normal">
            Fecha Creación Contrato
          </label>
          <input
            type="date"
            id="creationDate"
            name="creationDate"
            value={formData.creationDate}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-normal">
            Descripción Artículo
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Units */}
        <div>
          <label htmlFor="units" className="block font-normal">
            No. Unidades
          </label>
          <input
            type="number"
            id="units"
            name="units"
            value={formData.units}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            min={0}
            required
          />
        </div>

       

        {/* Unit Price */}
        <div>
          <label htmlFor="unitPrice" className="block font-normal">
            Precio Unitario
          </label>
          <input
            type="number"
            id="unitPrice"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            min={0}
            step="0.01"
            required
          />
        </div>
 {/* Lote */}
        <div>
          <label htmlFor="lote" className="block font-normal">
            Lote
          </label>
          <input
            type="text"
            id="lote"
            name="lote"
            value={formData.lote}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        {/* Max Delivery Date */}
        <div>
          <label htmlFor="maxDeliveryDate" className="block font-normal">
            Fecha Entrega Máxima
          </label>
          <input
            type="date"
            id="maxDeliveryDate"
            name="maxDeliveryDate"
            value={formData.maxDeliveryDate}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Real Delivery Date */}
        <div>
          <label htmlFor="realDeliveryDate" className="block font-normal">
            Fecha Real de Entrega
          </label>
          <input
            type="date"
            id="realDeliveryDate"
            name="realDeliveryDate"
            value={formData.realDeliveryDate}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Min Days Validity After Delivery */}
        <div>
          <label htmlFor="minDaysValidity" className="block font-normal">
            Días Mínimos Caducidad Después Fecha de Entrega
          </label>
          <input
            type="number"
            id="minDaysValidity"
            name="minDaysValidity"
            value={formData.minDaysValidity}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            min={0}
            required
          />
        </div>

        {/* Location Delivery (catalog) */}
        <div>
          <label htmlFor="locationDelivery" className="block font-normal">
            Localización Entrega
          </label>
          <select
            id="locationDelivery"
            name="locationDelivery"
            value={formData.locationDelivery}
            onChange={handleChange}
            className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
            required
          >
            {locations.map((loc) => (
              <option key={loc.idLocal} value={loc.idLocal}>
                {loc.descripcion}
              </option>
            ))}
          </select>
        </div>

        {/* Required Documents (catalog + add button + list) */}
        <div className="">
          <label htmlFor="requiredDocuments" className="block font-normal">
            Documentos Requeridos
          </label>
          <div className="flex items-center space-x-16 mt-1 ">
            <select
              id="requiredDocuments"
              name="requiredDocuments"
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(Number(e.target.value))}
              className="border-gray-300 rounded-md shadow-sm px-2 py-1 w-100"
              required
            >
              {documents.map((doc) => (
                <option key={doc.idDoc} value={doc.idDoc}>
                  {doc.descripcion}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddDocument}
              className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
            >
              Agregar
            </button>
          </div>
          {/* Lista adyacente de documentos agregados */}
          <ul className="mt-2 space-y-1">
            {formData.requiredDocuments.map((docId) => {
              const doc = documents.find((d) => d.idDoc === docId);
              return (
                <li
                  key={docId}
                  className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded"
                >
                  <span>{doc?.descripcion}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDocument(docId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-4 mt-16 justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Crear Registro
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContractForm;
