// src/components/CreateContractForm.tsx
import React, { useContext, useEffect, useState, type ChangeEvent } from "react"
import { UserContext } from "../context/UserContext"
import { valibotResolver } from "@hookform/resolvers/valibot"
import type { Address } from "viem"
import { createContractOnChain, type ContractInput } from "../lib/contractClient"
import { useForm, type SubmitHandler } from "react-hook-form"
import { ContractSchema, type ContractFormDataType, documentTypes } from "../lib/validators/contractValidator"
import type { Location, Document } from "../types"

interface contractFormProps {
  onSubmit: SubmitHandler<ContractFormDataType>
  initialData?: Partial<ContractFormDataType>
}

export function CreateContractForm({ onSubmit, initialData }: contractFormProps) {
  const [selectedDoc, setSelectedDoc] = useState<number>(1)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ContractFormDataType>({
    resolver: valibotResolver(ContractSchema),
    defaultValues: initialData || {
      unit: 0,
      unitPrice: 0.01,
      date: new Date().toISOString().split("T")[0],
      description: "",
      lote: "",
      documents: [],
    },
  })

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="
        bg-[var(--trustless-form-bg)]
        text-[var(--trustless-form-text)]
        p-4 block text-sm mb-1
        md:max-w-[60%] mx-auto
      "
    >
      {/* Unit Field */}
      <div>
        <label
          htmlFor="unit"
          className="
            block text-[var(--trustless-label-text)]
            font-semibold text-sm mb-1
          "
        >
          Unidades
        </label>
        <input
          id="unit"
          type="number"
          {...register("unit", { valueAsNumber: true })}
          className="
            w-full
            bg-[var(--trustless-input-bg)]
            border border-[var(--trustless-input-border)]
            text-[var(--trustless-input-text)]
            text-sm rounded-md
            focus:ring-[var(--trustless-focus-ring)]
            focus:border-[var(--trustless-focus-ring)]
            p-2 transition
          "
        />
        {errors.unit && (
          <p className="mt-1 text-sm text-[var(--trustless-error-text)]">
            {errors.unit.message}
          </p>
        )}
      </div>

      {/* Unit Price Field */}
      <div>
        <label
          htmlFor="unitPrice"
          className="
            block text-[var(--trustless-label-text)]
            font-semibold text-sm mb-1
          "
        >
          Precio Unitario ($)
        </label>
        <input
          id="unitPrice"
          type="number"
          step="0.01"
          {...register("unitPrice", { valueAsNumber: true })}
          className="
            w-full
            bg-[var(--trustless-input-bg)]
            border border-[var(--trustless-input-border)]
            text-[var(--trustless-input-text)]
            text-sm rounded-md
            focus:ring-[var(--trustless-focus-ring)]
            focus:border-[var(--trustless-focus-ring)]
            p-2 transition
          "
        />
        {errors.unitPrice && (
          <p className="mt-1 text-sm text-[var(--trustless-error-text)]">
            {errors.unitPrice.message}
          </p>
        )}
      </div>

      {/* Date Field */}
      <div>
        <label
          htmlFor="date"
          className="
            block text-[var(--trustless-label-text)]
            font-semibold text-sm mb-1
          "
        >
          Fecha
        </label>
        <input
          id="date"
          type="date"
          {...register("date")}
          className="
            w-full
            bg-[var(--trustless-input-bg)]
            border border-[var(--trustless-input-border)]
            text-[var(--trustless-input-text)]
            text-sm rounded-md
            focus:ring-[var(--trustless-focus-ring)]
            focus:border-[var(--trustless-focus-ring)]
            p-2 transition
          "
        />
        {errors.date && (
          <p className="mt-1 text-sm text-[var(--trustless-error-text)]">
            {errors.date.message}
          </p>
        )}
      </div>

      {/* Description and lote Fields */}
      <div>
        <label
          htmlFor="description"
          className="
            block text-[var(--trustless-label-text)]
            font-semibold text-sm mb-1
          "
        >
          Descripción (Opcional)
        </label>
        <textarea
          id="description"
          {...register("description")}
          className="
            w-2xl
            bg-[var(--trustless-input-bg)]
            border border-[var(--trustless-input-border)]
            text-[var(--trustless-input-text)]
            text-sm rounded-md
            focus:ring-[var(--trustless-focus-ring)]
            focus:border-[var(--trustless-focus-ring)]
            p-2 transition
          "
        />
      </div>
      <div>
        <label
          htmlFor="lote"
          className="
            block text-[var(--trustless-label-text)]
            font-semibold text-sm mb-1
          "
        >
          Lote (Opcional)
        </label>
        <input
          id="lote"
          type="text"
          {...register("lote")}
          className="
            w-full
            bg-[var(--trustless-input-bg)]
            border border-[var(--trustless-input-border)]
            text-[var(--trustless-input-text)]
            text-sm rounded-md
            focus:ring-[var(--trustless-focus-ring)]
            focus:border-[var(--trustless-focus-ring)]
            p-2 transition
          "
        />
      </div>

      {/* Documents Field */}
      <div>
        <label
          htmlFor="document-selector"
          className="
            block text-[var(--trustless-label-text)]
            font-semibold text-sm mb-1
          "
        >
          Documentos (Opcional)
        </label>
        <div className="flex items-center space-x-2 mt-1">
          <select
            id="document-selector"
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(Number(e.target.value))}
            className="
              w-full
              bg-[var(--trustless-input-bg)]
              border border-[var(--trustless-input-border)]
              text-[var(--trustless-input-text)]
              text-sm rounded-md
              focus:ring-[var(--trustless-focus-ring)]
              focus:border-[var(--trustless-focus-ring)]
              p-2 transition
            "
          >
            {Object.entries(documentTypes).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddDocument}
            className="
              bg-[var(--trustless-secondary-btn-bg)]
              text-[var(--trustless-secondary-btn-text)]
              border border-[var(--trustless-secondary-btn-border)]
              rounded-md px-3 py-1.5
              hover:bg-[var(--trustless-secondary-btn-hover-bg)]
              transition
            "
          >
            Agregar
          </button>
        </div>

        <div className="mt-2 space-y-2">
          {currentDocuments.map((docId) => (
            <div
              key={docId}
              className="
                flex justify-between items-center
                bg-[var(--trustless-doc-list-bg)]
                border border-[var(--trustless-doc-list-border)]
                text-[var(--trustless-doc-list-text)]
                text-sm rounded-md px-3 py-2
              "
            >
              <span className="text-white">{documentTypes[docId]}</span>
              <button
                type="button"
                onClick={() => handleRemoveDocument(docId)}
                className="
                  bg-[var(--trustless-secondary-btn-bg)]
                  text-[var(--trustless-secondary-btn-text)]
                  border border-[var(--trustless-secondary-btn-border)]
                  rounded-md px-3 py-1.5
                  hover:bg-[var(--trustless-secondary-btn-hover-bg)]
                  transition
                "
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        {errors.documents && (
          <p className="mt-1 text-sm text-[var(--trustless-error-text)]">
            {errors.documents.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="
          bg-[var(--trustless-btn-bg)]
          text-[var(--trustless-btn-text)]
          font-semibold rounded-md
          px-5 py-2.5 shadow
          hover:bg-[var(--trustless-btn-hover-bg)]
          focus:ring-4 focus:ring-[var(--trustless-btn-focus-ring)]
          transition
        "
      >
        Crear Contrato
      </button>
    </form>
  )
}

export default CreateContractForm
