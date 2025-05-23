
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { seedProfiles } from "@/scripts/seedProfiles";
import { syncQuestions } from "@/scripts/syncQuestions";

const DatabaseDebug = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
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

  const handleSeedProfiles = async () => {
    setIsSeeding(true);
    try {
      console.log('🌱 Iniciando população de perfis...');
      const result = await seedProfiles();
      console.log('✅ Resultado:', result);
      toast.success("Perfis populados com sucesso");
      checkDatabase(); // Atualizar a verificação
    } catch (error) {
      console.error('💥 Erro ao popular perfis:', error);
      toast.error("Erro ao popular perfis");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSyncQuestions = async () => {
    setIsSyncing(true);
    try {
      console.log('🔄 Iniciando sincronização de perguntas...');
      const result = await syncQuestions();
      console.log('✅ Resultado:', result);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      checkDatabase(); // Atualizar a verificação
    } catch (error) {
      console.error('💥 Erro ao sincronizar perguntas:', error);
      toast.error("Erro ao sincronizar perguntas");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-2">Debug do Banco de Dados</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={checkDatabase} 
          disabled={isChecking}
          variant="outline"
        >
          {isChecking ? "Verificando..." : "Verificar Tabelas"}
        </Button>
        
        <Button 
          onClick={handleSeedProfiles} 
          disabled={isSeeding}
          variant="outline"
          className="bg-green-100 hover:bg-green-200"
        >
          {isSeeding ? "Populando..." : "Popular Perfis"}
        </Button>
        
        <Button 
          onClick={handleSyncQuestions} 
          disabled={isSyncing}
          variant="outline"
          className="bg-blue-100 hover:bg-blue-200"
        >
          {isSyncing ? "Sincronizando..." : "Sincronizar Perguntas"}
        </Button>
      </div>
      
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
          
          {(results.perguntas.count === 0 || results.alternativas.count === 0 || results.perfis.count === 0) && (
            <div className="mt-2 p-2 bg-yellow-100 rounded text-yellow-800">
              ⚠️ Uma ou mais tabelas estão vazias. Utilize os botões acima para popular o banco de dados.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseDebug;
