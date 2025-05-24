
import { supabase } from "@/integrations/supabase/client";
import { Answer, DiagnosticResult, Profile } from "@/types/diagnostic";

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
    
    if (error) {
      console.error('❌ Erro ao buscar perfil dominante:', error);
      throw error;
    }
    
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
        console.error('❌ Erro ao salvar respostas:', saveError);
      } else {
        console.log('✅ Respostas salvas com sucesso');
      }
    }
    
    return {
      resultado: dominantProfile,
      pontuacoes: profileScores,
      perfil: profileData as Profile
    };
    
  } catch (error) {
    console.error('💥 Erro no envio do diagnóstico:', error);
    throw error;
  }
};
