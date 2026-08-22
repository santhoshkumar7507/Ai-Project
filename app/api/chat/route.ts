import { NextResponse } from "next/server";
import { processUltronQuery } from "@/lib/aiService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt provided" },
        { status: 400 }
      );
    }

    const response = await processUltronQuery(prompt);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error processing chat route:", error);
    return NextResponse.json(
      { error: "Internal ULTRON server error" },
      { status: 500 }
    );
  }
}
