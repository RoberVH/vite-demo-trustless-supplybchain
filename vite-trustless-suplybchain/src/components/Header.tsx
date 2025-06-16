import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import Menu, {menuItems, type MenuId} from "./Menu";
import { useNavigate } from "react-router-dom";


/**
 * Header component with:
 * - App title on the left
 * - A responsive Menu (hamburger on mobile, inline on desktop)
 * - UserSelector on the right
 * 
 *  it only controls menu visibility.
 */
const Header: React.FC = () => {
  // Control whether the mobile menu dropdown is open or closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track which menu ID is currently selected (so we can underline it)
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // Read currentUser and setter from context (UserSelector inside header will use it)
  const { currentUser, setCurrentUser, users } = useContext(UserContext);
  const navigate = useNavigate();     

  /**
   * Called when a Menu item is clicked.
   * 1) Update the underline state (activeMenu).
   * 2) Close the mobile dropdown (if it was open).
   */
  const onMenuSelect = (id: string | null) => {
    setActiveMenu(id as MenuId | null);
    setIsMobileMenuOpen(false);
    navigate(`/${menuItems.find((item) => item.idx === id)?.path}`);

  };

  const selectLandigPage = () => {
    onMenuSelect(null)
    setSelected(null)
    navigate('/')
  }
  

  return (
    <>
      {/* Top bar with title, desktop menu, and user selector */}
      <header className="bg-blue-600 text-white flex items-center justify-between px-4 py-3 md:px-6 md:py-4 h-16">
        {/* App title */}
        <div>
          <span className="text-xl font-bold md:text-2xl  ">
            <button className="hover:cursor-pointer focus:outline-none" onClick={selectLandigPage}>
              Trustless Sales Agreement
            </button>
            </span>
        </div>

        {/* Desktop menu: hidden on small screens (mobile) */}
        <div className="hidden md:block">
          <Menu
            className="flex"
            onSelect={onMenuSelect}
            selected={selected}
            setSelected={setSelected}
          />
        </div>

        {/* UserSelector always visible */}
        <div className="flex items-center">
          <select
            value={currentUser?.id ?? ""}
            onChange={e => {
              const uid = Number(e.target.value);
              const user = users.find(u => u.id === uid);
              if (user) setCurrentUser(user);
            }}
            className="bg-white text-gray-800 px-3  rounded-md -p-4 hover:bg-gray-200 cursor-pointer appearance-none focus:outline-none text-center"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hamburger button: only visible on mobile */}
        <button
          className="md:hidden ml-4 focus:outline-none"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            // "X" (close) icon
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger (open) icon
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile menu dropdown: only when isMobileMenuOpen is true */}
      {isMobileMenuOpen && (
        <nav className="bg-blue-600 text-white px-4 pt-2 pb-4 md:hidden">
          <Menu
            className="flex flex-col"
            onSelect={onMenuSelect}
            selected={selected}
            setSelected={setSelected}
          />
        </nav>
      )}
    </>
  );
};

export default Header;
