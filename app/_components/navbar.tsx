"use client";

import { UserButton } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const dataAtual = new Date();
  const mesAtual = format(dataAtual, "MM");
  const anoAtual = format(dataAtual, "yyyy");

  return (
    <nav className="flex justify-between px-8 py-4 border-b border-solid">
      <div className="flex items-center gap-10">
        <Image src={"/logo.svg"} width={173} height={39} alt="finance" />
        <Link
          href={"/"}
          className={
            pathname === "/"
              ? "text-primary font bold"
              : "text-muted-foreground"
          }
        >
          Dashboard
        </Link>
        <Link
          href={`/transactions?month=${mesAtual}&year=${anoAtual}`}
          className={
            pathname === "/transactions"
              ? "text-primary font bold"
              : "text-muted-foreground"
          }
        >
          Transações
        </Link>
        <Link
          href={"/subscription"}
          className={
            pathname === "/subscription"
              ? "text-primary font bold"
              : "text-muted-foreground"
          }
        >
          Assinatura
        </Link>
      </div>

      <UserButton showName />
    </nav>
  );
};

export default Navbar;
