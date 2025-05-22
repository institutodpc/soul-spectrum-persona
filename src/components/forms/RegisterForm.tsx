
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import GradientButton from "@/components/ui-custom/GradientButton";

// Modified the form schema to accept boolean for aceitoTermos instead of literal true
const formSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  sobrenome: z.string().min(2, {
    message: "O sobrenome deve ter pelo menos 2 caracteres.",
  }),
  dataNascimento: z.date({
    required_error: "Por favor, selecione uma data de nascimento.",
  }),
  sexo: z.enum(["masculino", "feminino", "outro"], {
    required_error: "Por favor, selecione uma opção.",
  }),
  estado: z.string({
    required_error: "Por favor, selecione um estado.",
  }),
  cidade: z.string().min(2, {
    message: "Por favor, informe sua cidade.",
  }),
  congregacao: z.string().min(2, {
    message: "Por favor, informe sua congregação.",
  }),
  email: z.string().email({
    message: "Por favor, informe um e-mail válido.",
  }),
  whatsapp: z.string().min(10, {
    message: "Por favor, informe um número de WhatsApp válido.",
  }),
  aceitoTermos: z.boolean().refine(val => val === true, {
    message: "Você precisa aceitar os termos de uso."
  })
});

type FormValues = z.infer<typeof formSchema>;

const estadosBrasileiros = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      cidade: "",
      congregacao: "",
      email: "",
      whatsapp: "",
      aceitoTermos: false,
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    toast.success("Cadastro realizado com sucesso!");
    // Normally, here you would save this data to your backend
    // Then redirect to the diagnostic page
    navigate("/diagnostic");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sobrenome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input placeholder="Seu sobrenome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Nascimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50 pointer-events-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={ptBR}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sexo"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Sexo</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="masculino" id="masculino" />
                      <label htmlFor="masculino" className="text-sm">Masculino</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="feminino" id="feminino" />
                      <label htmlFor="feminino" className="text-sm">Feminino</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="outro" id="outro" />
                      <label htmlFor="outro" className="text-sm">Outro</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-72">
                    {estadosBrasileiros.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Sua cidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="congregacao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Congregação</FormLabel>
                <FormControl>
                  <Input placeholder="Sua congregação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="seu.email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="aceitoTermos"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Aceito os termos de uso e concordo que meus dados serão utilizados anonimamente para estatísticas
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <GradientButton type="submit" className="w-full py-6">
          Descobrir meu Perfil
        </GradientButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
