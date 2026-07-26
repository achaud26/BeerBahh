import { NextResponse } from "next/server";
import { bars, CrowdLevel } from "@/data/bars";
import { getCrowdOverrides } from "@/lib/store";

const levels: CrowdLevel[] = ["dead", "chill", "buzzing", "packed"];

function asCrowd(value: string | undefined, fallback: CrowdLevel): CrowdLevel {
  if (value && levels.includes(value as CrowdLevel)) {
    return value as CrowdLevel;
  }
  return fallback;
}

export async function GET() {
  const overrides = await getCrowdOverrides();
  return NextResponse.json({
    bars: bars.map((bar) => ({
      ...bar,
      crowd: asCrowd(overrides[bar.id], bar.crowd),
      chat: undefined,
    })),
  });
}
