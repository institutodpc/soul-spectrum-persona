
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
    // Tentar obter as perguntas do Supabase
    const { data: perguntasData, error: perguntasError } = await supabase
      .from('perguntas')
      .select('*')
      .order('id');
    
    if (perguntasError || !perguntasData || perguntasData.length === 0) {
      console.log('Erro ou nenhuma pergunta encontrada no Supabase, usando JSON local:', perguntasError);
      // Fallback para o JSON local se não houver perguntas no Supabase
      const response = await fetch('/perguntas_dpc_33.json');
      if (!response.ok) {
        throw new Error('Failed to fetch questions from local JSON');
      }
      return await response.json();
    }
    
    // Para cada pergunta, buscar suas alternativas
    const questions: Question[] = await Promise.all(
      perguntasData.map(async (pergunta) => {
        const { data: opcoesData, error: opcoesError } = await supabase
          .from('alternativas')
          .select('*')
          .eq('pergunta_id', pergunta.id);
        
        if (opcoesError) {
          console.error(`Erro ao buscar opções para pergunta ${pergunta.id}:`, opcoesError);
          return null;
        }
        
        return {
          id: pergunta.id,
          texto: pergunta.texto,
          opcoes: opcoesData.map(opcao => ({
            id: opcao.id,
            texto: opcao.texto,
            perfis: opcao.perfis
          }))
        };
      })
    );
    
    // Filtrar possíveis valores nulos (caso alguma consulta de opções tenha falhado)
    return questions.filter(q => q !== null) as Question[];
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    // Fallback para o JSON local em caso de erro
    const response = await fetch('/perguntas_dpc_33.json');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return await response.json();
  }
};
