"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface Setlist {
  id: string;
  name: string;
  image_url?: string;
}

export default function SetlistsPage() {
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSetlists = async () => {
      const { data, error } = await supabase
        .from("setlists")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("Error al cargar setlists.");
      } else {
        setSetlists(data);
      }
    };

    fetchSetlists();
  }, []);

  const handleNameSave = async (id: string) => {
    if (!editedName.trim()) return;

    const { error } = await supabase
      .from("setlists")
      .update({ name: editedName.trim() })
      .eq("id", id)
      .select(); // 👈 ESTO ES CRÍTICO CON RLS

    if (error) {
      console.error(error);
      toast.error("No se pudo actualizar el nombre.");
    } else {
      toast.success("Nombre actualizado.");
      setSetlists((prev) =>
        prev.map((s) => (s.id === id ? { ...s, name: editedName } : s)),
      );
      setEditingId(null);
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    const filePath = `setlists/${id}-${file.name}`;
    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, { upsert: true });

    if (error) {
      toast.error("No se pudo subir la imagen.");
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;

    await supabase.from("setlists").update({ image_url: url }).eq("id", id);
    setSetlists((prev) =>
      prev.map((s) => (s.id === id ? { ...s, image_url: url } : s)),
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Setlists</h1>

      {setlists.length === 0 ? (
        <div className="text-muted-foreground flex h-64 items-center justify-center text-lg">
          No hay setlists creados.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {setlists.map((setlist) => (
            <div
              key={setlist.id}
              className="group relative cursor-pointer overflow-hidden rounded-xl shadow-md"
              onClick={() => router.push(`/setlists/${setlist.id}`)}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={setlist.image_url || "/placeholder.svg"}
                  alt="Setlist image"
                  fill
                  className="rounded-xl object-cover"
                />
                <label className="absolute right-2 bottom-2 z-10 text-xs text-white opacity-0 group-hover:opacity-100">
                  <Input
                    type="file"
                    accept="image/*"
                    className="w-32 cursor-pointer text-xs text-white"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (e.target.files?.[0]) {
                        handleImageUpload(setlist.id, e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
              <div
                className="bg-background p-3"
                onClick={(e) => e.stopPropagation()}
              >
                {editingId === setlist.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      className="text-center text-sm"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleNameSave(setlist.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleNameSave(setlist.id)}
                    >
                      ✔
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-center text-sm font-semibold">
                      {setlist.name}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(setlist.id);
                        setEditedName(setlist.name);
                      }}
                    >
                      <Pencil className="text-muted-foreground h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
