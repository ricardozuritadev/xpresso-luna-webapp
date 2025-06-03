"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ROUTES } from "@/constants/routes.constants";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

export function AuthForm<T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  async function handleSubmit(): ReturnType<SubmitHandler<T>> {}

  const buttonText = formType === "SIGN_IN" ? "Entrar" : "Registrarse";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {field.name === "email"
                    ? "Email"
                    : field.name === "password"
                      ? "Contraseña"
                      : "Usuario"}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
                    {...field}
                    placeholder={
                      field.name === "email"
                        ? "marito_el_guaso@email.com"
                        : field.name === "username"
                          ? "Little Paper"
                          : "Mete bien la contraseña"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting
            ? buttonText === "Entrar"
              ? "Entrando..."
              : "Registrando..."
            : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p>
            ¿No tienes una cuenta?{" "}
            <Link href={ROUTES.SIGN_UP} className="text-orange-400">
              Regístrate
            </Link>
          </p>
        ) : (
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link className="text-orange-400" href={ROUTES.SIGN_IN}>
              Entra
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
}
