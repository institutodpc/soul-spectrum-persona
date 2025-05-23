
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DatabaseDebug = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<any>(null);

  const checkDatabase = async () => {
    setIsChecking(true);
    setResults(null);
    
    try {
      console.log('🔍 Verificando tabelas do banco...');
      
      // Verificar perguntas
      const { data: perguntas, error: perguntasError, count: perguntasCount } = await supabase
        .from('perguntas')
        .select('*', { count: 'exact' });
      
      // Verificar alternativas
      const { data: alternativas, error: alternativasError, count: alternativasCount } = await supabase
        .from('alternativas')
        .select('*', { count: 'exact' });
      
      // Verificar perfis
      const { data: perfis, error: perfisError, count: perfisCount } = await supabase
        .from('perfis')
        .select('*', { count: 'exact' });
      
      const result = {
        perguntas: {
          count: perguntasCount,
          error: perguntasError?.message,
          sample: perguntas?.slice(0, 2)
        },
        alternativas: {
          count: alternativasCount,
          error: alternativasError?.message,
          sample: alternativas?.slice(0, 2)
        },
        perfis: {
          count: perfisCount,
          error: perfisError?.message,
          sample: perfis?.slice(0, 2)
        }
      };
      
      setResults(result);
      console.log('📊 Resultado verificação:', result);
      
      if (perguntasError || alternativasError || perfisError) {
        toast.error("Erro ao verificar algumas tabelas");
      } else {
        toast.success("Verificação concluída");
      }
      
    } catch (error) {
      console.error('💥 Erro na verificação:', error);
      toast.error("Erro ao verificar banco de dados");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Debug do Banco de Dados</h3>
      
      <Button 
        onClick={checkDatabase} 
        disabled={isChecking}
        className="mb-4"
      >
        {isChecking ? "Verificando..." : "Verificar Tabelas"}
      </Button>
      
      {results && (
        <div className="space-y-2 text-sm">
          <div>
            <strong>Perguntas:</strong> {results.perguntas.count || 0} registros
            {results.perguntas.error && <span className="text-red-500"> - Erro: {results.perguntas.error}</span>}
          </div>
          
          <div>
            <strong>Alternativas:</strong> {results.alternativas.count || 0} registros
            {results.alternativas.error && <span className="text-red-500"> - Erro: {results.alternativas.error}</span>}
          </div>
          
          <div>
            <strong>Perfis:</strong> {results.perfis.count || 0} registros
            {results.perfis.error && <span className="text-red-500"> - Erro: {results.perfis.error}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseDebug;
