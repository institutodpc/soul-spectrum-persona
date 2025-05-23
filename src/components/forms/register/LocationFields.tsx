
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

const LocationFields = () => {
  const { control, setValue, watch } = useFormContext<FormValues>();
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  const selectedState = watch("estado");

  // Fetch cities when state is selected
  useEffect(() => {
    if (selectedState) {
      setLoading(true);
      fetchCitiesByState(selectedState)
        .then(citiesData => {
          setCities(citiesData);
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
            <FormLabel>Estado (opcional)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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
        control={control}
        name="cidade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade (opcional)</FormLabel>
            {selectedState ? (
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Carregando cidades..." : "Selecione uma cidade"} />
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
                <Input placeholder="Selecione um estado primeiro" disabled />
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
            <FormLabel>Congregação</FormLabel>
            <FormControl>
              <Input placeholder="Sua congregação" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default LocationFields;
