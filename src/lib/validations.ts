import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El email es obligatorio, shunsho" })
    .email({ message: "Pon bien el email!" }),

  password: z
    .string()
    .min(1, { message: "La contraseña es obligatoria, shunsho" })
    .max(50, { message: "La contraseña no puede tener más de 50 caracteres" }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "El nombre de usuario es obligatorio, shunsho" })
    .max(30, {
      message: "El nombre de usuario no puede tener más de 30 caracteres",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "El nombre de usuario solo puede contener letras, números y guiones bajos",
    }),

  email: z
    .string()
    .min(1, { message: "El email es obligatorio, shunsho" })
    .email({ message: "Pon bien el email!" }),

  password: z
    .string()
    .min(1, { message: "La contraseña es obligatoria, shunsho" })
    .max(50, { message: "La contraseña no puede tener más de 50 caracteres" }),
});
