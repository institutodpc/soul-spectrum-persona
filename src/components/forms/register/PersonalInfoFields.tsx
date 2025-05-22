
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { FormValues } from "./schema";

const PersonalInfoFields = () => {
  const {
    control,
    setValue
  } = useFormContext<FormValues>();

  // Função para lidar com a entrada manual de data
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      try {
        // Tenta converter a string em formato DD/MM/YYYY para um objeto Date
        const parts = dateValue.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Mês é baseado em zero (0-11)
          const year = parseInt(parts[2], 10);
          const date = new Date(year, month, day);

          // Verifica se a data é válida
          if (!isNaN(date.getTime())) {
            setValue('dataNascimento', date);
          }
        }
      } catch (error) {
        console.error("Erro ao converter data:", error);
      }
    }
  };

  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
        control={control}
        name="dataNascimento"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data de Nascimento</FormLabel>
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="DD/MM/AAAA" 
                value={field.value ? format(field.value, "dd/MM/yyyy", {
                  locale: ptBR
                }) : ""} 
                onChange={handleDateInput} 
                className="w-full" 
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-10 p-0",
                      !field.value && "text-muted-foreground"
                    )}
                    type="button"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50 pointer-events-auto" align="start">
                  <Calendar 
                    mode="single" 
                    selected={field.value} 
                    onSelect={field.onChange} 
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")} 
                    initialFocus 
                    locale={ptBR} 
                    className="p-3 pointer-events-auto" 
                  />
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
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
    </>
  );
};

export default PersonalInfoFields;
