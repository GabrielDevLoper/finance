import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json(); // Obtendo o corpo da requisição

  return NextResponse.json({ body });
};
