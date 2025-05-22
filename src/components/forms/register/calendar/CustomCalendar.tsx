
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import YearMonthSelector from "./YearMonthSelector";

interface CustomCalendarProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ 
  selectedDate, 
  onSelect 
}) => {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(selectedDate || new Date());
  
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

export default CustomCalendar;
