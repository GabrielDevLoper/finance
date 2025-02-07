import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  console.log(req.body);

  return NextResponse.json({ body: req.body });
};
