
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { seedProfiles } from "@/scripts/seedProfiles";

const SeedProfilesButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSeedProfiles = async () => {
    setIsLoading(true);
    try {
      await seedProfiles();
      toast.success("Perfis adicionados com sucesso!");
    } catch (error) {
      console.error("Error seeding profiles:", error);
      toast.error("Erro ao adicionar perfis.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleSeedProfiles} 
      disabled={isLoading} 
      variant="outline"
    >
      {isLoading ? "Adicionando..." : "Adicionar Perfis Exemplo"}
    </Button>
  );
};

export default SeedProfilesButton;
