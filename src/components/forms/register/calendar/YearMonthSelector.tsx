
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearMonthSelectorProps {
  date: Date;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const YearMonthSelector: React.FC<YearMonthSelectorProps> = ({ 
  date, 
  onMonthChange, 
  onYearChange 
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

export default YearMonthSelector;
