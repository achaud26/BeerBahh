import { PublicProfileClient } from "@/components/PublicProfileClient";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <PublicProfileClient username={username.toLowerCase()} />;
}
