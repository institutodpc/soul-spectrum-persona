
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
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
import { FormValues, estadosBrasileiros } from "./schema";
import { fetchCitiesByState } from "@/services/locationService";
import { Loader2 } from "lucide-react";

const LocationFields = () => {
  const { control, setValue, watch, formState: { errors } } = useFormContext<FormValues>();
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const selectedState = watch("estado");

  // Efeito para buscar cidades quando o estado é selecionado
  useEffect(() => {
    if (selectedState) {
      setLoading(true);
      fetchCitiesByState(selectedState)
        .then(citiesData => {
          setCities(citiesData);
          // Limpa a cidade selecionada quando o estado muda
          setValue("cidade", "");
        })
        .catch(error => {
          console.error("Erro ao buscar cidades:", error);
          setCities([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setCities([]);
    }
  }, [selectedState, setValue]);

  return (
    <>
      <FormField
        control={control}
        name="estado"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estado *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <FormControl>
                <SelectTrigger className={errors.estado ? "border-red-500" : ""}>
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
        control={control}
        name="cidade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade *</FormLabel>
            {selectedState ? (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className={errors.cidade ? "border-red-500" : ""}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Carregando cidades...</span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Selecione uma cidade" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-72">
                  {cities.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <FormControl>
                <Input 
                  placeholder="Selecione um estado primeiro" 
                  disabled 
                  className={errors.cidade ? "border-red-500" : ""}
                />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="congregacao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Congregação *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Sua congregação" 
                {...field} 
                className={errors.congregacao ? "border-red-500" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default LocationFields;
