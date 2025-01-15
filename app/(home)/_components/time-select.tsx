"use client";

import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/app/_components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MONTH_OPTIONS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const YEARS_OPTIONS = [
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
  { value: "2027", label: "2027" },
  { value: "2028", label: "2028" },
  { value: "2029", label: "2029" },
  { value: "2030", label: "2030" },
];

const TimeSelect = () => {
  const { push } = useRouter();

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    if (selectedYear) {
      push(`/?month=${month}&year=${selectedYear}`);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    if (selectedMonth) {
      push(`/?month=${selectedMonth}&year=${year}`);
    }
  };
  return (
    <>
      <Select onValueChange={(value) => handleMonthChange(value)}>
        <SelectTrigger className="rounded-full w-[150px]">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MONTH_OPTIONS.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleYearChange(value)}>
        <SelectTrigger className="rounded-full w-[150px]">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {YEARS_OPTIONS.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default TimeSelect;
