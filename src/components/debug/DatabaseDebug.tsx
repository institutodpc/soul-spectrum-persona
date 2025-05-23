
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DatabaseDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDatabase = async () => {
    setLoading(true);
    try {
      console.log('🔍 Verificando estrutura do banco...');
      
      // Verificar perguntas
      const { data: perguntas, error: perguntasError, count: perguntasCount } = await supabase
        .from('perguntas')
        .select('*', { count: 'exact' })
        .limit(3);

      // Verificar alternativas
      const { data: alternativas, error: alternativasError, count: alternativasCount } = await supabase
        .from('alternativas')
        .select('*', { count: 'exact' })
        .limit(5);

      // Verificar perfis
      const { data: perfis, error: perfisError, count: perfisCount } = await supabase
        .from('perfis')
        .select('*', { count: 'exact' })
        .limit(3);

      // Verificar auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      const info = {
        timestamp: new Date().toISOString(),
        auth: {
          user: user ? { id: user.id, email: user.email } : null,
          error: authError
        },
        perguntas: {
          count: perguntasCount,
          data: perguntas,
          error: perguntasError
        },
        alternativas: {
          count: alternativasCount,
          data: alternativas,
          error: alternativasError
        },
        perfis: {
          count: perfisCount,
          data: perfis,
          error: perfisError
        }
      };

      setDebugInfo(info);
      console.log('📊 Debug info:', info);
      
    } catch (error) {
      console.error('❌ Erro no debug:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Debug do Banco de Dados</CardTitle>
        <Button onClick={checkDatabase} disabled={loading}>
          {loading ? 'Verificando...' : 'Verificar Banco'}
        </Button>
      </CardHeader>
      <CardContent>
        {debugInfo && (
          <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseDebug;
