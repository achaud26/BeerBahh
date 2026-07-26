import { googleConfigured } from "@/lib/auth-flags";
import { RadarApp } from "@/components/RadarApp";

export default function RadarPage() {
  return <RadarApp googleEnabled={googleConfigured} />;
}
