import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  console.log("=> session: ", session);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
