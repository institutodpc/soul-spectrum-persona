
import React from "react";
import { useFormContext } from "react-hook-form";
import { useRef } from "react";
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
  const { control, setValue } = useFormContext<FormValues>();
  
  // Função para formatar o número de WhatsApp no padrão brasileiro (XX) XXXXX-XXXX
  const formatWhatsAppNumber = (value: string) => {
    if (!value) return value;
    
    // Remove todos os caracteres que não são dígitos
    const digits = value.replace(/\D/g, "");
    
    // Aplica a máscara conforme os dígitos inseridos
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 7) {
      return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    } else {
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
    }
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const formattedValue = formatWhatsAppNumber(e.target.value);
    onChange(formattedValue);
  };

  return (
    <>
      <FormField
        control={control}
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
        control={control}
        name="whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <FormControl>
              <Input 
                placeholder="(00) 00000-0000" 
                value={field.value}
                onChange={(e) => handleWhatsAppChange(e, field.onChange)}
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
