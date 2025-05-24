
import { z } from "zod";

export const formSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  sobrenome: z.string().min(2, {
    message: "O sobrenome deve ter pelo menos 2 caracteres.",
  }),
  dataNascimento: z.date().optional(),
  sexo: z.enum(["masculino", "feminino", "outro"]).optional(),
  estado: z.string().min(1, {
    message: "Por favor, selecione um estado.",
  }),
  cidade: z.string().min(1, {
    message: "Por favor, selecione uma cidade.",
  }),
  congregacao: z.string().min(2, {
    message: "Por favor, informe sua congregação.",
  }),
  email: z.string().email({
    message: "Por favor, informe um e-mail válido.",
  }),
  whatsapp: z.string()
    .min(14, { message: "Por favor, informe um número de WhatsApp válido com DDD." })
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, {
      message: "Formato inválido. Use (XX) XXXXX-XXXX."
    }),
  aceitoTermos: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos de uso."
  })
});

export type FormValues = z.infer<typeof formSchema>;

export const estadosBrasileiros = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];
