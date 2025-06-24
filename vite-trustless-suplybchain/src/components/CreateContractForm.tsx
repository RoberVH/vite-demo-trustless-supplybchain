// src/components/CreateContractForm.tsx
import React, { useContext, useEffect, useState, type ChangeEvent } from "react"
import { UserContext } from "../context/UserContext"
import { valibotResolver } from "@hookform/resolvers/valibot"
import type { Address } from "viem"
import { createContractOnChain, type ContractInput } from "../lib/contractClient"
import { useForm, type SubmitHandler } from "react-hook-form"
import { ContractSchema, type ContractFormDataType, documentTypes } from "../lib/validators/contractValidator"
import type { Location, Document } from "../types"


interface ContractFormProps {
  onSubmit: SubmitHandler<ContractFormDataType>
  initialData?: Partial<ContractFormDataType>
}

export function CreateContractForm({ onSubmit, initialData }: ContractFormProps) {
  const [selectedDoc, setSelectedDoc] = useState<number>(1)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContractFormDataType>({
    resolver: valibotResolver(ContractSchema),
    //mode: "onChange",
    defaultValues: initialData || {
      unit: 0,
      unitPrice: 0.01,
      date: new Date().toISOString().split("T")[0],
      description: "",
      lote: "",
      documents: [],
    },
  })

  useEffect(() => {
  console.log("Errores actuales:", errors)
}, [errors])


  const currentDocuments = watch("documents", []) || []

  const handleAddDocument = () => {
    if (!currentDocuments.includes(selectedDoc)) {
      setValue("documents", [...currentDocuments, selectedDoc], { shouldValidate: true })
    }
  }

  const handleRemoveDocument = (docToRemove: number) => {
    setValue(
      "documents",
      currentDocuments.filter((doc) => doc !== docToRemove),
      { shouldValidate: true }
    )
  }

  return (
    <div className="w-128 mx-auto">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="form-container"
    >
      <div className="bg-site-primary   mt-2 rounded-xl">
        <p className="text-center text-primary-foreground text-sm p-2 ">
          Crear Contrato
        </p>
      </div>
      {/* Unit Field */}
      <div className="form-field">
        <input
          id="unit"
          type="number"
          {...register("unit", { valueAsNumber: true })}
          className="form-input"
        />
        <label
          htmlFor="unit"
          className="form-label"
        >
          Unidades
        </label>
        {errors.unit && (
          <p className="mt-1 text-sm text-error">{errors.unit.message}</p>
        )}
      </div>

      {/* Unit Price Field */}
      <div className="form-field">
        <input
          id="unitPrice"
          type="number"
          step="0.01"
          {...register("unitPrice", { valueAsNumber: true })}
          className="form-input"
        />
        <label
          htmlFor="unitPrice"
          className="form-label"
        >
          Precio Unitario ($)
        </label>
        {errors.unitPrice && (
          <p className="mt-1 text-sm text-error">{errors.unitPrice.message}</p>
        )}
      </div>
      {/* Date Field */}
      <div className="form-field">
        <input
          id="date"
          type="date"
          {...register("date")}
          className="form-input"
        />
        <label
          htmlFor="date"
          className="form-label"
        >
          Fecha
        </label>
        {errors.date && (
          <p className="mt-1 text-sm text-error">{errors.date.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="form-field">
        <textarea
          id="description"
          {...register("description")}
          className="form-input"
        />
        <label
          htmlFor="description"
          className="form-label"
        >
          Descripción
        </label>
      </div>

      {/* Lote Field */}
      <div className="form-field">
        <input
          id="lote"
          type="text"
          {...register("lote")}
          className="form-input"
        />
        <label
          htmlFor="lote"
          className="form-label"
        >
          Lote (Opcional)
        </label>
      </div>

      {/* Documents Field */}
      <div className="form-field">
      <div className="flex items-baseline gap-2">
        <div className="flex-1 ">
            <select
              id="document-selector"
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(Number(e.target.value))}
            className="form-input  w-full"
            >
              {Object.entries(documentTypes).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          <label
            htmlFor="document-selector"
            className="form-label"
          >
            Documentos (Opcional)
          </label>
          </div>
          <button
            type="button"
            onClick={handleAddDocument}
            className="button-add"
          >
            Agregar
          </button>
        </div>
        {Boolean(currentDocuments.length) &&
        <div className="mt-4 mx-4 py-2  px-1 border border-site-primary text-primary rounded-sm  justify-start">
          {Boolean(currentDocuments.length) && currentDocuments.map((docId) => (
            <div className="w-max-w-16 flex gap-2 place-items-baseline" key={docId}>
              <div className="flex items-center gap-2">
              </div>
              <div
                key={docId}
                className="max-w-sm truncate"
              >
                <button className="text-site-primary text-xs font-semibold wrap hover:cursor-pointer" onClick={() => handleRemoveDocument(docId)} title="Click para Remover" >
                      * {documentTypes[docId]}
                </button>
                </div>

            </div>
          ))}
        </div>}
        {errors.documents && (
          <p className="mt-1 text-sm text-error">{errors.documents.message}</p>
        )}
      </div>

      <button
        type="submit"
        className=" 
          button-submit-form m-4  md:w-32"
      >
        Nuevo
      </button>
    </form>
    </div>
  )
}

export default CreateContractForm