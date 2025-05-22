
export interface QuestionOption {
  id: string;
  texto: string;
  perfis: string[];
}

export interface Question {
  id: string;
  texto: string;
  opcoes: QuestionOption[];
}

export interface Answer {
  perguntaId: string;
  resposta: string;
  perfis: string[];
}

export interface Profile {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  emocao_predominante: string;
  influencia: string;
  destino: string;
  licao_espiritual: string;
  demonio_associado: string;
  operacao: string;
  artimanha: string;
  refugio: string;
  personagem_biblico: string;
  exaltacao: string;
  formacao: string;
  dores: string[];
}

export interface DiagnosticResult {
  resultado: string;
  pontuacoes: Record<string, number>;
  perfil: Profile;
}

export interface User {
  id: string;
  email: string;
  nome: string;
  sobrenome: string;
  dataNascimento?: Date;
  sexo?: string;
  estado?: string;
  cidade?: string;
  congregacao?: string;
  whatsapp?: string;
}
