"use client";

import { UserButton } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SwitchTheme } from "./swith-theme";
import MobileDrawer from "./mobile-drawer-navbar";

const Navbar = () => {
  const pathname = usePathname();
  const dataAtual = new Date();
  const mesAtual = format(dataAtual, "MM");
  const anoAtual = format(dataAtual, "yyyy");

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b border-solid">
      {/* Logo e Links para telas grandes */}
      <div className="flex items-center gap-10">
        {/* A logo será escondida em telas pequenas */}
        <Image
          src={"/logo.svg"}
          width={173}
          height={39}
          alt="finance"
          className="hidden lg:block" // Adicionando a classe hidden lg:block
        />
        <div className="hidden lg:flex gap-10">
          <Link
            href={"/"}
            className={
              pathname === "/"
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }
          >
            Dashboard
          </Link>
          <Link
            href={`/transactions?month=${mesAtual}&year=${anoAtual}`}
            className={
              pathname === "/transactions"
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }
          >
            Transações
          </Link>
          <Link
            href={"/subscription"}
            className={
              pathname === "/subscription"
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }
          >
            Assinatura
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Botão do Drawer para telas mobile com margem à direita */}
        <div className="mr-24">
          {" "}
          {/* Adicionando margem à direita */}
          <MobileDrawer />
        </div>
        <SwitchTheme />
        <UserButton showName />
      </div>
    </nav>
  );
};

export default Navbar;
