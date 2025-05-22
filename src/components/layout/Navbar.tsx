
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glassmorphic mx-4 mt-4 px-6 py-4 rounded-xl flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/884c7af3-f607-435e-ab59-9d63dcc13d7c.png"
            alt="DPC Persona"
            className="h-8"
          />
          <span className="font-bold text-lg">DPC Persona</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            to="/register" 
            className="text-sm font-medium hover:text-dpc-coral transition-colors"
          >
            Descobrir Meu Perfil
          </Link>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
          <Link 
            to="/about" 
            className="text-sm font-medium hover:text-dpc-coral transition-colors"
          >
            Sobre
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
