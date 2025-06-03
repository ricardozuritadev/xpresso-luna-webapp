"use client";

import { AuthForm } from "@/components/forms/auth-form";
import { SignUpSchema } from "@/lib/validations";

export default function SignUp() {
  return (
    <div>
      <AuthForm
        formType="SIGN_UP"
        schema={SignUpSchema}
        defaultValues={{ email: "", username: "", password: "" }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />
    </div>
  );
}
