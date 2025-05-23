
import { supabase } from "@/integrations/supabase/client";
import { Answer, DiagnosticResult, Profile, Question } from "@/types/diagnostic";

export const submitDiagnostic = async (answers: Answer[]): Promise<DiagnosticResult> => {
  try {
    // Count scores for each profile
    const profileScores: Record<string, number> = {};
    
    answers.forEach(answer => {
      answer.perfis.forEach(profile => {
        if (!profileScores[profile]) {
          profileScores[profile] = 0;
        }
        profileScores[profile] += 1;
      });
    });
    
    // Find the dominant profile
    let maxScore = 0;
    let dominantProfile = "";
    
    Object.entries(profileScores).forEach(([profile, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantProfile = profile;
      }
    });
    
    // Get profile data from Supabase
    const { data: profileData, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('slug', dominantProfile)
      .single();
    
    if (error) throw error;
    
    // Save responses to Supabase if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const responsesToSave = answers.map(answer => ({
        user_id: user.id,
        pergunta_id: answer.perguntaId,
        resposta: answer.resposta,
        perfis: answer.perfis
      }));
      
      const { error: saveError } = await supabase
        .from('respostas')
        .insert(responsesToSave);
        
      if (saveError) {
        console.error('Error saving responses:', saveError);
      }
    }
    
    return {
      resultado: dominantProfile,
      pontuacoes: profileScores,
      perfil: profileData as Profile
    };
    
  } catch (error) {
    console.error('Error in diagnostic submission:', error);
    throw error;
  }
};

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    console.log('🔍 Iniciando busca de perguntas...');
    
    // Primeiro, verificar se temos dados básicos nas tabelas
    console.log('📊 Verificando estrutura das tabelas...');
    
    // Verificar perguntas
    const { data: perguntasCount, error: countError } = await supabase
      .from('perguntas')
      .select('id', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Erro ao contar perguntas:', countError);
    } else {
      console.log(`📝 Total de perguntas na base: ${perguntasCount}`);
    }
    
    // Verificar alternativas
    const { data: alternativasCount, error: altCountError } = await supabase
      .from('alternativas')
      .select('id', { count: 'exact', head: true });
    
    if (altCountError) {
      console.error('❌ Erro ao contar alternativas:', altCountError);
    } else {
      console.log(`📋 Total de alternativas na base: ${alternativasCount}`);
    }
    
    // Se não há dados, usar JSON local
    if (!perguntasCount || perguntasCount === 0) {
      console.log('⚠️ Nenhuma pergunta no banco, usando JSON local...');
      const response = await fetch('/perguntas_dpc_33.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions from local JSON');
      }
      const questions = await response.json();
      console.log(`✅ Carregadas ${questions.length} perguntas do JSON local`);
      return questions;
    }
    
    // Buscar perguntas do Supabase
    console.log('🔄 Buscando perguntas do Supabase...');
    const { data: perguntasData, error: perguntasError } = await supabase
      .from('perguntas')
      .select('*')
      .order('id');
    
    if (perguntasError) {
      console.error('❌ Erro ao buscar perguntas:', perguntasError);
      throw perguntasError;
    }
    
    if (!perguntasData || perguntasData.length === 0) {
      console.log('⚠️ Nenhuma pergunta encontrada, usando JSON local...');
      const response = await fetch('/perguntas_dpc_33.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions from local JSON');
      }
      const questions = await response.json();
      console.log(`✅ Carregadas ${questions.length} perguntas do JSON local`);
      return questions;
    }
    
    console.log(`📝 Encontradas ${perguntasData.length} perguntas no banco`);
    
    // Buscar todas as alternativas
    console.log('🔄 Buscando alternativas...');
    const { data: todasAlternativas, error: alternativasError } = await supabase
      .from('alternativas')
      .select('*');
    
    if (alternativasError) {
      console.error('❌ Erro ao buscar alternativas:', alternativasError);
      throw alternativasError;
    }
    
    if (!todasAlternativas || todasAlternativas.length === 0) {
      console.log('⚠️ Nenhuma alternativa encontrada, usando JSON local...');
      const response = await fetch('/perguntas_dpc_33.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions from local JSON');
      }
      const questions = await response.json();
      console.log(`✅ Carregadas ${questions.length} perguntas do JSON local`);
      return questions;
    }
    
    console.log(`📋 Encontradas ${todasAlternativas.length} alternativas no banco`);
    
    // Agrupar alternativas por pergunta_id
    const alternativasPorPergunta: Record<string, any[]> = {};
    todasAlternativas.forEach(alt => {
      if (!alternativasPorPergunta[alt.pergunta_id]) {
        alternativasPorPergunta[alt.pergunta_id] = [];
      }
      alternativasPorPergunta[alt.pergunta_id].push(alt);
    });
    
    // Montar perguntas com alternativas
    const questions: Question[] = perguntasData.map(pergunta => {
      const alternativas = alternativasPorPergunta[pergunta.id] || [];
      return {
        id: pergunta.id,
        texto: pergunta.texto,
        opcoes: alternativas.map(opcao => ({
          id: opcao.id,
          texto: opcao.texto,
          perfis: Array.isArray(opcao.perfis) ? opcao.perfis : []
        }))
      };
    });
    
    // Filtrar perguntas sem alternativas
    const questionsComAlternativas = questions.filter(q => q.opcoes.length > 0);
    
    console.log(`✅ Montadas ${questionsComAlternativas.length} perguntas com alternativas`);
    
    if (questionsComAlternativas.length === 0) {
      console.log('⚠️ Nenhuma pergunta válida montada, usando JSON local...');
      const response = await fetch('/perguntas_dpc_33.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions from local JSON');
      }
      const questions = await response.json();
      console.log(`✅ Carregadas ${questions.length} perguntas do JSON local`);
      return questions;
    }
    
    // Log detalhado das primeiras perguntas para debug
    questionsComAlternativas.slice(0, 2).forEach((q, index) => {
      console.log(`📋 Pergunta ${index + 1}:`, {
        id: q.id,
        texto: q.texto.substring(0, 50) + '...',
        opcoes: q.opcoes.length
      });
    });
    
    return questionsComAlternativas;
    
  } catch (error) {
    console.error('💥 Erro crítico ao buscar perguntas:', error);
    
    // Fallback para JSON local em caso de erro
    try {
      console.log('🔄 Tentando fallback para JSON local...');
      const response = await fetch('/perguntas_dpc_33.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions from local JSON');
      }
      const questions = await response.json();
      console.log(`✅ Fallback: Carregadas ${questions.length} perguntas do JSON local`);
      return questions;
    } catch (fallbackError) {
      console.error('💥 Erro no fallback também:', fallbackError);
      throw new Error('Não foi possível carregar perguntas de nenhuma fonte');
    }
  }
};
