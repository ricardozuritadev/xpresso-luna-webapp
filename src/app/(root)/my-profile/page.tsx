"use client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<{
    full_name: string;
    avatar_url: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="text-muted-foreground flex h-screen flex-col items-center justify-center">
        <p className="mb-4">Cargando perfil...</p>
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const supabaseUser = user as User | null;

  const avatarUrl: string =
    profile?.avatar_url && profile.avatar_url.length > 0
      ? profile.avatar_url
      : (supabaseUser?.user_metadata?.avatar_url ?? "");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center space-y-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl} alt="Avatar" />
          <AvatarFallback>
            {profile?.full_name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <h1 className="text-2xl font-bold">{profile?.full_name}</h1>

        <Button onClick={handleLogout} className="bg-destructive text-white">
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
