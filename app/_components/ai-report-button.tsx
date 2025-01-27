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
// import { generateAiReport } from "../(home)/_actions/generate-ai-report-with-chatgpt";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import Markdown from "react-markdown";
import Link from "next/link";
import { toast } from "sonner";
import { generateAiReportWithDeepSeek } from "../(home)/_actions/generate-ai-report-with-deepseek";

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
      const aiReport = await generateAiReportWithDeepSeek({ month, year });
      toast.success("Relatório da IA gerado com sucesso ✔️", {
        className: "bg-[#55B02E] text-white border-none",
      });
      setReport(aiReport);
    } catch (error) {
      console.log(error);
    } finally {
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
