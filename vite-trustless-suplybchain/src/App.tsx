import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/landigPage";
import CreateContractPage from "./pages/CreateContractPage";
import Opcion2Page from "./pages/Opcion2Page";
import Opcion3Page from "./pages/Opcion3Page";
import { UserProvider } from "./context/UserContext";


/**
 * Main App component. Envuelve todo en UserProvider.
 */
const App: React.FC = () => {
  return (
 <UserProvider>
      <BrowserRouter>
        <div className=" flex flex-col h-screen">
          {/*Header fixed all time */}
          <Header />

          {/* Page main body displays component according to path selected */}
          <main className="flex-grow bg-gray-100 overflow-y-auto">
            <Routes>
              {/* default route */}
              <Route
                path="/"
                element={<Navigate to="/landing-page" replace />}
              />

              {/* Each route loads its component */}
              <Route path="/landing-page" element={<LandingPage />} />
              <Route path="/crear-contrato" element={<CreateContractPage />} />
              <Route path="/opcion-2" element={<Opcion2Page />} />
              <Route path="/opcion-3" element={<Opcion3Page />} />
              {/* 404: any other no defined path */}
              <Route
                path="*"
                element={
                  <div className="p-6 text-center text-red-600">
                    Página no encontrada (404)
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;

