
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto py-6">
      <div className="container flex flex-col items-center justify-center">
        <div className="mb-4">
          <img 
            src="/lovable-uploads/884c7af3-f607-435e-ab59-9d63dcc13d7c.png"
            alt="DPC Persona Logo"
            className="h-8"
          />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} DPC Persona. Todos os direitos reservados.
        </p>
        <div className="flex space-x-4 mt-2">
          <a href="#" className="text-xs hover:text-dpc-pink transition-colors">
            Termos de Uso
          </a>
          <a href="#" className="text-xs hover:text-dpc-pink transition-colors">
            Política de Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
