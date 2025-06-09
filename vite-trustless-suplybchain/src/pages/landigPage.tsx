import React from "react";
import Opcion2Selector from "../components/Opcion2Selector";

/**
 */
const LandingPage: React.FC = () => {
  return (
    <div className="p-16 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Trustless Retail Blockchain Purchase Agreement
      </h1>
      <span className="text-lg text-gray-600 text-center">
        Demonstration App that creates a Contract to enforce a Retailer's purchase of goods from Buyer
      </span>
    </div>
  );
};

export default LandingPage;
