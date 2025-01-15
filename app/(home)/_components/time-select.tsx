"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/app/_components/ui/select";
import { MONTH_OPTIONS, YEARS_OPTIONS } from "@/app/_constants/utils";

interface TimeSelectProps {
  url?: string;
  onFilterChange?: (filters: { month: string; year: string }) => void;
}

const TimeSelect = ({ url = "/", onFilterChange }: TimeSelectProps) => {
  const { push } = useRouter();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    if (selectedYear) {
      const filters = { month, year: selectedYear };
      onFilterChange?.(filters);
      push(`${url}?month=${month}&year=${selectedYear}`);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    if (selectedMonth) {
      const filters = { month: selectedMonth, year, teste: "teste" };
      onFilterChange?.(filters);
      push(`${url}?month=${selectedMonth}&year=${year}`);
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
          {YEARS_OPTIONS.map((year) => (
            <SelectItem key={year.value} value={year.value}>
              {year.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default TimeSelect;
