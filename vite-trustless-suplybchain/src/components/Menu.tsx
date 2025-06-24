import React, { type Dispatch, type SetStateAction } from "react";

 /**
  * Defines a single menu entry.
  */
interface MenuItem {
  idx: string;
  path: string;
  label: string;
}

/**
 * Props for Menu: allows passing additional Tailwind classes 
 * (e.g., to switch between horizontal and vertical layouts).
 */
interface MenuProps {
  className?: string;
  onSelect?: (id: string | null) => void;
  selected:string | null;
  setSelected: Dispatch<SetStateAction<string | null>>;
}

export type MenuId = "crear-contrato" | "opcion-2" | "opcion-3";

/**
 * App Menu entries definition
 */
export const menuItems: MenuItem[] = [
  // { idx: 0, path: "/", label: "Landing Page" },
  { idx: '1', path: "crear-contrato", label: "Crear Contrato" },
  { idx: '2', path: "opcion-2", label: "Opción 2" },
  { idx: '3', path: "opcion-3", label: "Opción 3" },
];


/**
 * Menu component renders three entries. 
 * When an item is clicked, it becomes “selected” (underline style).
 */
const Menu: React.FC<MenuProps> = ({ className = "", onSelect, selected, setSelected }) => {
  
  /**
   * Handler for clicking a menu item.
   * 1) Update internal “selected” state (for underline styling).
   * 2) Call onSelect callback (if provided) with that id.
   */
  const handleClick = (id: string | null) => {
    setSelected(id);
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <nav className=" border border-gray-200 p-4 rounded-4xl w-full flex justify-center items-center">
      <ul className={`${className} ${className.includes("flex-col") ? "space-y-2" : "space-x-4"} `}>
        {menuItems.map((item) => (
          <li key={item.idx}>
            <button
              className={`px-3 py-1 transition  text-sm text-menu-primary relative 
                ${
                selected === item.idx
                  ? "menu-selected"
                  : "hover:scale-115"
              }`}
              onClick={() => handleClick(item.idx)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
