"use client";

import { UserButton } from "@clerk/nextjs";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const dataAtual = new Date();
  const mesAtual = format(dataAtual, "MM");
  const anoAtual = format(dataAtual, "yyyy");

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

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

      {/* Botão de menu hamburguer para telas pequenas */}
      <div className="lg:hidden">
        <button
          onClick={toggleMenu}
          className="text-primary focus:outline-none"
        >
          {menuOpen ? "X" : "☰"}
        </button>
      </div>

      {/* Drawer (Menu lateral) para telas pequenas */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } fixed inset-0 z-50 lg:hidden`}
        onClick={toggleMenu}
      >
        <div
          className={`${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } fixed left-0 top-0 w-64 bg-gray-900 text-white h-full p-4 transition-transform ease-in-out duration-300`}
        >
          <div className="flex justify-end">
            <button onClick={toggleMenu} className="text-white">
              X
            </button>
          </div>
          <Link
            href={"/"}
            className={`block py-2 px-4 ${
              pathname === "/"
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href={`/transactions?month=${mesAtual}&year=${anoAtual}`}
            className={`block py-2 px-4 ${
              pathname === "/transactions"
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }`}
          >
            Transações
          </Link>
          <Link
            href={"/subscription"}
            className={`block py-2 px-4 ${
              pathname === "/subscription"
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }`}
          >
            Assinatura
          </Link>
        </div>
      </div>

      <UserButton showName />
    </nav>
  );
};

export default Navbar;
