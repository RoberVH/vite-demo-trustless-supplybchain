import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

/**
 * Component that displays the current user’s name.
 * When clicked, it renders a dropdown (combo box) con todos los usuarios.
 * Al seleccionar, actualiza el usuario en el contexto.
 */
const UserSelector: React.FC = () => {
  const { currentUser, setCurrentUser, users } = useContext(UserContext);
  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const newUser = users.find((u) => u.id === selectedId);
    if (newUser) {
      setCurrentUser(newUser);
      setEditing(false);
    }
  };

  return (
    <div className="relative">
      {editing ? (
        <select
          value={currentUser?.id}
          onChange={handleChange}
          onBlur={() => setEditing(false)}
          className="bg-white text-gray-800 border border-gray-300 rounded-md px-2 py-1"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="bg-white text-gray-800 px-3 py-1 rounded-md hover:bg-gray-100"
        >
          {currentUser?.name || "Seleccionar Usuario"}
        </button>
      )}
    </div>
  );
};

export default UserSelector;
