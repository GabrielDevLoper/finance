"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  TRANSACTION_STATUS_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transaction";
import { MONTH_OPTIONS, YEARS_OPTIONS } from "@/app/_constants/utils";

import { FilterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FilterTransactionProps {
  onFilterChange?: (filters: { status?: string; type?: string }) => void;
}

export default function FiterT({ onFilterChange }: FilterTransactionProps) {
  const { push } = useRouter();
  const [status, setSelectStatus] = useState("");
  const [type, setSelectType] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFilter = () => {
    const filters = { type, status };
    onFilterChange?.(filters);

    // Monta a query string com base nos parâmetros fornecidos
    const queryString = [
      `type=${type}`,
      month != null && `month=${month}`,
      year != null && `year=${year}`,
      status != null && `status=${status}`,
    ]
      .filter(Boolean) // Filtra os valores não nulos ou indefinidos
      .join("&");

    // Faz o push para a URL com os filtros
    push(`/transactions?${queryString}`);
    setIsDialogOpen(false);
  };

  const clearFilters = () => {
    setSelectStatus("");
    setSelectType("");
    setMonth("");
    setYear("");

    // Monta a query string com base nos parâmetros fornecidos
    const queryString = [
      `type=${type}`,
      month != null && `month=${month}`,
      year != null && `year=${year}`,
      status != null && `status=${status}`,
    ]
      .filter(Boolean) // Filtra os valores não nulos ou indefinidos
      .join("&");

    // Faz o push para a URL com os filtros
    push(`/transactions?${queryString}`);
  };

  return (
    <>
      <Button
        className="rounded-lg bg-cyan-700 hover:bg-cyan-800"
        onClick={clearFilters}
      >
        Limpar Filtros
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-lg bg-cyan-700 hover:bg-cyan-800">
            <FilterIcon />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filtro</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <Select onValueChange={setSelectStatus}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectType}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setMonth}>
              <SelectTrigger className="rounded-full">
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
            <Select onValueChange={setYear}>
              <SelectTrigger className="rounded-full">
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
          </div>
          <DialogFooter>
            <Button onClick={handleFilter}>Buscar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
