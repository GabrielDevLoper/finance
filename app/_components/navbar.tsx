import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between px-8 py-4 border-b border-solid">
      <div className="flex items-center gap-10">
        <Image src={"/logo.svg"} width={173} height={39} alt="finance" />
        <Link href={"/"}>Dashboard</Link>
        <Link href={"/transactions"}>Transações</Link>
        <Link href={"/subscription"}>Assinatura</Link>
      </div>

      <UserButton showName />
    </nav>
  );
};

export default Navbar;
