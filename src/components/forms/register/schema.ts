
import { z } from "zod";

export const formSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  sobrenome: z.string().min(2, {
    message: "O sobrenome deve ter pelo menos 2 caracteres.",
  }),
  dataNascimento: z.date({
    required_error: "Por favor, selecione uma data de nascimento.",
  }).refine(
    (date) => {
      const now = new Date();
      const minDate = new Date(1900, 0, 1);
      return date <= now && date >= minDate;
    },
    {
      message: "Data de nascimento inválida. Deve estar entre 01/01/1900 e hoje."
    }
  ),
  sexo: z.enum(["masculino", "feminino", "outro"], {
    required_error: "Por favor, selecione uma opção.",
  }),
  estado: z.string({
    required_error: "Por favor, selecione um estado.",
  }),
  cidade: z.string({
    required_error: "Por favor, selecione uma cidade.",
  }),
  congregacao: z.string().min(2, {
    message: "Por favor, informe sua congregação.",
  }),
  email: z.string().email({
    message: "Por favor, informe um e-mail válido.",
  }),
  whatsapp: z.string().min(10, {
    message: "Por favor, informe um número de WhatsApp válido.",
  }).refine(
    (value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 11;
    },
    {
      message: "O WhatsApp deve ter entre 10 e 11 dígitos."
    }
  ),
  aceitoTermos: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos de uso."
  })
});

export type FormValues = z.infer<typeof formSchema>;

export const estadosBrasileiros = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];
