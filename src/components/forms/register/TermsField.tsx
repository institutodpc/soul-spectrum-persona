
import React from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormValues } from "./schema";

const TermsField = () => {
  const { control, formState: { errors } } = useFormContext<FormValues>();

  return (
    <FormField
      control={control}
      name="aceitoTermos"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className={errors.aceitoTermos ? "border-red-500" : ""}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className={errors.aceitoTermos ? "text-red-500" : ""}>
              Aceito os termos de uso e concordo que meus dados serão utilizados anonimamente para estatísticas
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TermsField;
