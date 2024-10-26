import { NextResponse, NextRequest } from "next/server"; 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); 
    const response = await fetch("http://localhost:3000/opinions", {
      headers: {     "Content-Type": "application/json"   },
      body: JSON.stringify({hola:"algo"}), 
      method: "POST", 
    });
    const data = await response.json(); 
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
