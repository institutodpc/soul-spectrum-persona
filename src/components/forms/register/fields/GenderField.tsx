
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormValues } from "../schema";

const GenderField = () => {
  const { control } = useFormContext<FormValues>();

  return (
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
  );
};

export default GenderField;
