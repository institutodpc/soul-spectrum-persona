
import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glassmorphic mx-4 mt-4 px-6 py-4 rounded-xl flex items-center justify-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/884c7af3-f607-435e-ab59-9d63dcc13d7c.png" alt="DPC Persona" className="h-10 object-contain" />
        </Link>
      </nav>
    </header>;
};
export default Navbar;
