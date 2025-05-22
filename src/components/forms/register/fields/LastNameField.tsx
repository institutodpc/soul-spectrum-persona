
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues } from "../schema";

const LastNameField = () => {
  const { control } = useFormContext<FormValues>();

  return (
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
  );
};

export default LastNameField;
