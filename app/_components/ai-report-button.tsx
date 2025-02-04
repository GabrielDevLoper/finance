"use client";

import { BotIcon, Loader2Icon, PrinterIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {useCallback, useEffect, useState} from "react";
import { ScrollArea } from "./ui/scroll-area";
import Markdown from "react-markdown";
import Link from "next/link";
import { toast } from "sonner";
import { generateAiReport } from "../(home)/_actions/generate-ai-report-with-chatgpt";
// import {generateAiReportWithDeepSeek} from "@/app/(home)/_actions/generate-ai-report-with-deepseek";
import { getRelatoriosMensais } from "../_actions/get-report";

interface AiReportButtonProps {
  month: string;
  year: string;
  hasPremiumPlan: boolean;
}

const AiReportButton = ({
  month,
  year,
  hasPremiumPlan,
}: AiReportButtonProps) => {
  const [report, setReport] = useState<string | null>();
  const [reportIsLoading, setReportIsLoading] = useState(false);

  const handleGenerateReportClick = async () => {
    try {
      setReportIsLoading(true);

      const aiReport = await generateAiReport({ month, year });

      // Toast de sucesso
      toast.success("Relatório da IA gerado com sucesso ✔️", {
        className: "bg-[#55B02E] text-white border-none",
      });

      // Atualiza o estado com o relatório gerado
      setReport(aiReport);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);

      // Toast de erro
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao gerar o relatório.", // Exibe a mensagem de erro ou uma mensagem padrão
        {
          className: "bg-red-500 text-white border-none", // Estilo do toast de erro
        }
      );
    } finally {
      // Finaliza o estado de carregamento
      setReportIsLoading(false);
    }
  };

  const handlePrintReportClick = () => {
    const printContent = document.getElementById("printable-report");
    const WindowPrint = window.open("", "", "width=900,height=650");

    if (report && WindowPrint && printContent) {
      WindowPrint.document.write(
        "<html><head><title>Relatório</title></head><body>"
      );
      WindowPrint.document.write(printContent.innerHTML);
      WindowPrint.document.write("</body></html>");
      WindowPrint.document.close();
      WindowPrint.focus();
      WindowPrint.print();
    }
  };

  const loadReport = useCallback(async () => {
    try {
      setReportIsLoading(true);
      const relatorios = await getRelatoriosMensais(month, year);

      if (relatorios?.conteudo) {
        setReport(relatorios.conteudo);
      } else {
        setReport(null);
      }
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao carregar o relatório.",
        { className: "bg-red-500 text-white border-none" }
      );
    } finally {
      setReportIsLoading(false);
    }
  }, [month, year]); // Dependências do useCallback

  useEffect(() => {
    loadReport();
  }, [loadReport]); // Agora o useEffect depende do useCallback, que já tem as dependências corretas

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="font-bold">
          Relatório IA
          <BotIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>

              <DialogDescription>
                Use inteligência artificial para gerar um relatório com insights
                sobre suas finanças
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="prose max-h-[450px] text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white">
              <div id="printable-report">
                <Markdown>{report}</Markdown>
              </div>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"ghost"}>Cancelar</Button>
              </DialogClose>
              <Button
                onClick={handleGenerateReportClick}
                disabled={reportIsLoading}
              >
                {reportIsLoading && <Loader2Icon className="animate-spin" />}
                Gerar relatório
              </Button>
              <Button
                onClick={handlePrintReportClick}
                disabled={!report}
                variant={"ghost"}
              >
                <PrinterIcon className="mr-2" />
                Imprimir relatório
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>

              <DialogDescription>
                Você precisa de um plano premium para gerar relatórios com IA.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"ghost"}>Cancelar</Button>
              </DialogClose>

              <Button asChild>
                <Link href={"/subscription"}>Assinar plano premium</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
