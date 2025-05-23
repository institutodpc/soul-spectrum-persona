
import { supabase } from "@/integrations/supabase/client";

// Perfis completos para o diagnóstico
const profiles = [
  {
    slug: "perfeccionista",
    nome: "O Perfeccionista",
    descricao: "Busca constante pela perfeição e excelência.",
    emocao_predominante: "Ansiedade e autocrítica",
    influencia: "Tende a adiar decisões por medo de cometer erros, busca sempre a opção perfeita.",
    destino: "Limitação de oportunidades por medo de falhar ou ser julgado(a).",
    licao_espiritual: "Aprender que o crescimento vem através dos erros e imperfeições.",
    demonio_associado: "Espírito de controle e rigidez",
    operacao: "Instiga pensamentos de que nada que você faz é bom o suficiente.",
    artimanha: "Faz você acreditar que só será aceito(a) quando for perfeito(a).",
    refugio: "Controle excessivo e padrões inalcançáveis.",
    personagem_biblico: "Marta (irmã de Maria e Lázaro)",
    exaltacao: "Jesus ensinou Marta sobre a importância de estar em sua presença antes de servir perfeitamente.",
    formacao: "Geralmente formado na infância através de pressões familiares por excelência ou críticas constantes.",
    dores: ["Ansiedade", "Estresse", "Sentimento de inadequação", "Exaustão emocional"]
  },
  {
    slug: "culpado",
    nome: "O Culpado",
    descricao: "Vive sob o peso constante da culpa e arrependimento.",
    emocao_predominante: "Culpa e vergonha",
    influencia: "Toma decisões baseadas em compensar erros passados ou evitar sentir mais culpa.",
    destino: "Ciclo de autocastigo e dificuldade em avançar devido ao peso dos erros passados.",
    licao_espiritual: "Experimentar o poder do perdão e da graça divina.",
    demonio_associado: "Espírito de acusação",
    operacao: "Mantém você preso ao passado através de lembranças constantes dos erros.",
    artimanha: "Convence você de que não merece perdão ou uma nova chance.",
    refugio: "Autopunição e isolamento.",
    personagem_biblico: "Pedro (após negar Jesus)",
    exaltacao: "Jesus restaurou Pedro publicamente após sua negação, confiando-lhe o cuidado de seu rebanho.",
    formacao: "Desenvolvido através de experiências de rejeição, punição severa ou falhas significativas.",
    dores: ["Vergonha crônica", "Baixa autoestima", "Dificuldade em aceitar perdão", "Autossabotagem"]
  },
  {
    slug: "ansioso",
    nome: "O Ansioso",
    descricao: "Vive em constante estado de preocupação com o futuro.",
    emocao_predominante: "Medo e insegurança",
    influencia: "Toma decisões baseadas no pior cenário possível, evitando riscos.",
    destino: "Vida limitada pelo medo, perdendo oportunidades de crescimento e bênçãos.",
    licao_espiritual: "Desenvolver confiança em Deus e viver no momento presente.",
    demonio_associado: "Espírito de medo",
    operacao: "Projeta cenários catastróficos constantemente em sua mente.",
    artimanha: "Faz você acreditar que preocupação é responsabilidade e cuidado.",
    refugio: "Planejamento excessivo e controle.",
    personagem_biblico: "Gideão",
    exaltacao: "Deus transformou Gideão de um homem medroso em um guerreiro valente.",
    formacao: "Geralmente formado por experiências de insegurança, traumas ou instabilidade na infância.",
    dores: ["Ataques de pânico", "Insônia", "Tensão física constante", "Fadiga mental"]
  },
  {
    slug: "vitimista",
    nome: "O Vitimista",
    descricao: "Vê-se constantemente como vítima das circunstâncias e pessoas.",
    emocao_predominante: "Ressentimento e autocompaixão",
    influencia: "Evita assumir responsabilidade pelas decisões, culpando fatores externos.",
    destino: "Estagnação e relações prejudicadas pelo ressentimento acumulado.",
    licao_espiritual: "Assumir responsabilidade pela própria vida e perdoar genuinamente.",
    demonio_associado: "Espírito de autocompaixão",
    operacao: "Distorce situações para sempre posicionar você como vítima.",
    artimanha: "Faz você acreditar que merece compensação por seus sofrimentos.",
    refugio: "Busca constante de validação e simpatia dos outros.",
    personagem_biblico: "Jó (temporariamente)",
    exaltacao: "Deus restaurou Jó quando ele parou de questionar e aceitou a soberania divina.",
    formacao: "Desenvolvido através de experiências genuínas de injustiça não processadas adequadamente.",
    dores: ["Amargura", "Sensação de impotência", "Dificuldade em confiar", "Isolamento social"]
  },
  {
    slug: "controlador",
    nome: "O Controlador",
    descricao: "Busca controlar pessoas e situações ao seu redor.",
    emocao_predominante: "Ansiedade e medo de perder o controle",
    influencia: "Toma decisões baseadas em manter poder e influência sobre os outros.",
    destino: "Relações superficiais e isolamento devido ao comportamento dominador.",
    licao_espiritual: "Render o controle a Deus e confiar em Seu plano soberano.",
    demonio_associado: "Espírito de domínio",
    operacao: "Faz você sentir que precisa controlar tudo para estar seguro.",
    artimanha: "Convence você que os outros são incapazes sem sua direção.",
    refugio: "Planejamento obsessivo e manipulação sutil.",
    personagem_biblico: "Rei Saul",
    exaltacao: "Saul foi um exemplo negativo; sua necessidade de controle levou à sua queda.",
    formacao: "Geralmente formado pela experiência de caos ou insegurança na infância.",
    dores: ["Alto nível de estresse", "Dificuldade em delegar", "Medo do desconhecido", "Tensão nos relacionamentos"]
  }
];

export const seedProfiles = async () => {
  try {
    // Log detalhado
    console.log("🌱 Iniciando população de perfis...");
    
    let stats = {
      success: 0,
      error: 0,
      total: profiles.length
    };
    
    // Inserir cada perfil individualmente para melhor rastreamento
    for (const profile of profiles) {
      console.log(`Tentando inserir perfil: ${profile.slug}`);
      
      const { data, error } = await supabase
        .from('perfis')
        .upsert(profile, {
          onConflict: 'slug',
          ignoreDuplicates: false // atualizar se já existir
        });
      
      if (error) {
        console.error(`❌ Erro ao inserir perfil ${profile.slug}:`, error);
        stats.error++;
      } else {
        console.log(`✅ Perfil ${profile.slug} inserido/atualizado com sucesso`);
        stats.success++;
      }
    }
    
    // Verificar se os perfis foram inseridos
    const { data: perfisData, count: perfisCount, error: checkError } = await supabase
      .from('perfis')
      .select('*', { count: 'exact' });
      
    if (checkError) {
      console.error("❌ Erro ao verificar perfis após inserção:", checkError);
    } else {
      console.log(`✅ Total de perfis no banco: ${perfisCount}`);
    }
    
    return { 
      success: stats.error === 0, 
      message: `Perfis populados: ${stats.success}/${stats.total} com sucesso.`,
      stats 
    };
  } catch (error) {
    console.error("💥 Erro durante a população de perfis:", error);
    return { success: false, message: "Erro ao popular perfis." };
  }
};
