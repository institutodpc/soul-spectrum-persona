
// Supabase Edge Function para adicionar uma política RLS que permite inserções anônimas na tabela perfis
// Esta função deve ser executada por um usuário com privilégios administrativos

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string

serve(async (req) => {
  // Criar cliente Supabase com a chave de serviço para ter privilégios administrativos
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Executar SQL para criar política que permite inserções anônimas na tabela perfis
    const { error } = await supabase.rpc('create_anon_insert_policy')
    
    if (error) {
      throw error
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Política para inserções anônimas na tabela perfis criada com sucesso" 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error("Erro ao criar política:", error)
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
