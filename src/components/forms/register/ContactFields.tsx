
import React from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "./schema";

const ContactFields = () => {
  const { control, formState: { errors } } = useFormContext<FormValues>();

  // Função para formatar o WhatsApp como (00) 00000-0000
  const formatWhatsapp = (value: string) => {
    if (!value) return value;
    
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a formatação
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  return (
    <>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail *</FormLabel>
            <FormControl>
              <Input 
                placeholder="seu.email@exemplo.com" 
                {...field} 
                type="email"
                className={errors.email ? "border-red-500" : ""}
                autoComplete="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="whatsapp"
        render={({ field: { onChange, value, ...rest } }) => (
          <FormItem>
            <FormLabel>WhatsApp *</FormLabel>
            <FormControl>
              <Input 
                placeholder="(00) 00000-0000" 
                value={formatWhatsapp(value)}
                onChange={(e) => {
                  // Mantém apenas os números para o valor armazenado
                  const rawValue = e.target.value.replace(/\D/g, '');
                  // Limita a 11 dígitos
                  const trimmedValue = rawValue.slice(0, 11);
                  onChange(formatWhatsapp(trimmedValue));
                }}
                {...rest}
                className={errors.whatsapp ? "border-red-500" : ""}
                type="tel"
                autoComplete="tel"
                maxLength={15}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ContactFields;
