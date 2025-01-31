"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";

const MobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dataAtual = new Date();
  const mesAtual = format(dataAtual, "MM");
  const anoAtual = format(dataAtual, "yyyy");

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="lg:hidden p-2">
          <Menu className="h-6 w-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent className=" h-screen top-0 right-0 left-auto w-[300px] translate-x-full data-[state=open]:translate-x-0 transition-transform">
        <div className="p-4">
          <Link
            href={"/"}
            className={
              pathname === "/"
                ? "text-primary font-bold block py-2"
                : "text-muted-foreground block py-2"
            }
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href={`/transactions?month=${mesAtual}&year=${anoAtual}`}
            className={
              pathname === "/transactions"
                ? "text-primary font-bold block py-2"
                : "text-muted-foreground block py-2"
            }
            onClick={() => setIsOpen(false)}
          >
            Transações
          </Link>
          <Link
            href={"/subscription"}
            className={
              pathname === "/subscription"
                ? "text-primary font-bold block py-2"
                : "text-muted-foreground block py-2"
            }
            onClick={() => setIsOpen(false)}
          >
            Assinatura
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
