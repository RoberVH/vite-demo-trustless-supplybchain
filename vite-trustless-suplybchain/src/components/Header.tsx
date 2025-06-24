// src/components/Header.tsx
import React, { useState, useContext } from "react"
import { UserContext } from "../context/UserContext"
import Menu, { menuItems, type MenuId } from "./Menu"
import { useNavigate } from "react-router-dom"

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const { currentUser, setCurrentUser, users } = useContext(UserContext)
  const navigate = useNavigate()

  const onMenuSelect = (id: string | null) => {
    setActiveMenu(id as MenuId | null)
    setIsMobileMenuOpen(false)
    navigate(`/${menuItems.find(item => item.idx === id)?.path}`)
  }

  const selectLandingPage = () => {
    onMenuSelect(null)
    setSelected(null)
    navigate("/")
  }

  return (
    <>
      <header className="bg-primary flex items-center justify-between px-4 py-3 md:px-6 md:py-4 text-site-primary border-b-2 border-site-primary/30">
        <div className="">
            <button
              onClick={selectLandingPage}
              className="font-industrial font-semibold text-site-primary  hover:cursor-pointer focus:outline-none text-xl blur-[0.7px] opacity-80
              px-2 before:content-[''] before:absolute before:inset-0  before:rounded-3xl before:bg-site-primary/20 before:blur before:opacity-70"
            >
              Trustless Sale Agreements
            </button>
        </div>

        <div className="hidden md:block">
          <Menu
            className="flex text-site-primary"
            onSelect={onMenuSelect}
            selected={selected}
            setSelected={setSelected}
          />
        </div>

        <div className="flex items-center">
          <select
            value={currentUser?.id ?? ""}
            onChange={e => {
              const uid = Number(e.target.value)
              const user = users.find(u => u.id === uid)
              if (user) setCurrentUser(user)
            }}
            className="
              bg-base-100 
              px-3 py-2 rounded-md
              hover:bg-base-200
              cursor-pointer appearance-none
              focus:outline-none focus:ring-primary focus:border-primary
              text-center
              transition
            "
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="md:hidden ml-4 focus:outline-none "
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-6 w-6 text-site-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6 text-site-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

      {isMobileMenuOpen && (
        <nav className="border-b-2 border-site-primary bg-primary text-site-primary px-4 pt-2 pb-4 md:hidden">
          <Menu
            className="flex flex-col"
            onSelect={onMenuSelect}
            selected={selected}
            setSelected={setSelected}
          />
        </nav>
      )}
    </>
  )
}

export default Header
