
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormValues } from "./schema";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Componente para seleção de mês e ano
const YearMonthSelector = ({ 
  date, 
  onMonthChange, 
  onYearChange 
}: { 
  date: Date, 
  onMonthChange: (month: number) => void, 
  onYearChange: (year: number) => void 
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <div className="flex justify-between items-center p-2">
      <Select
        value={date.getMonth().toString()}
        onValueChange={(value) => onMonthChange(parseInt(value))}
      >
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month.toString()}>
              {format(new Date(2000, month, 1), 'MMMM', { locale: ptBR })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={date.getFullYear().toString()}
        onValueChange={(value) => onYearChange(parseInt(value))}
      >
        <SelectTrigger className="w-[90px]">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px] overflow-y-auto">
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Componente customizado para o calendário
const CustomCalendar = ({ 
  selectedDate, 
  onSelect 
}: { 
  selectedDate: Date | undefined, 
  onSelect: (date: Date | undefined) => void 
}) => {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(selectedDate || new Date());
  
  // Corrigido: Importamos o Calendar diretamente no topo do arquivo, não usando require
  
  const handleMonthChange = (month: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(month);
    setCurrentMonth(newDate);
  };
  
  const handleYearChange = (year: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
  };
  
  return (
    <div className="p-0">
      <YearMonthSelector 
        date={currentMonth} 
        onMonthChange={handleMonthChange} 
        onYearChange={handleYearChange} 
      />
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        disabled={(date) =>
          date > new Date() || date < new Date("1900-01-01")
        }
        initialFocus
        className={cn("p-3 pointer-events-auto")}
      />
    </div>
  );
};

const PersonalInfoFields = () => {
  const {
    control,
    setValue,
    formState: { errors }
  } = useFormContext<FormValues>();

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
              <PopoverContent className="w-auto p-0" align="start">
                <CustomCalendar selectedDate={field.value} onSelect={field.onChange} />
              </PopoverContent>
            </Popover>
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
