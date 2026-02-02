"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = authSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
});

const getSiteUrl = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

  if (siteUrl) {
    return siteUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export type AuthResult = {
  success: boolean;
  error?: string;
};

/**
 * Sign in with email and password
 */
export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  const validation = authSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  redirect(redirectTo);
}

/**
 * Sign up with email and password (immediate login, no email confirmation)
 */
export async function signUp(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string) || undefined;

  const validation = signUpSchema.safeParse({ email, password, fullName });
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  // Auto sign-in after signup
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      success: false,
      error: signInError.message,
    };
  }

  redirect("/dashboard");
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Get the current authenticated user
 */
export async function getUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || null,
    avatarUrl: user.user_metadata?.avatar_url || null,
  };
}

/**
 * Sign in with social provider (Google/GitHub)
 */
export async function signInWithProvider(provider: "google" | "github") {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Delete the current user account
 * This will delete all user data from the database (CASCADE)
 * and remove the user from Supabase Auth
 */
export async function deleteAccount(password: string): Promise<AuthResult> {
  const supabase = await createSupabaseServerClient();

  // Verificar se o usuário está autenticado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "Não autorizado: usuário não encontrado",
    };
  }

  // Validar senha antes de deletar
  if (!password || password.length < 6) {
    return {
      success: false,
      error: "Senha inválida",
    };
  }

  // Re-autenticar para confirmar a senha
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password,
  });

  if (signInError) {
    return {
      success: false,
      error: "Senha incorreta",
    };
  }

  // Deletar todos os arquivos do usuário no Storage
  try {
    // Lista todos os buckets comuns que podem ter arquivos do usuário
    const buckets = ["avatars", "uploads", "media", "documents"];

    for (const bucketName of buckets) {
      // Lista todos os arquivos do usuário neste bucket
      const { data: files, error: listError } = await supabase.storage
        .from(bucketName)
        .list(user.id);

      // Se o bucket não existir, pular
      if (listError) continue;

      // Se houver arquivos, deletá-los
      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${user.id}/${file.name}`);
        await supabase.storage.from(bucketName).remove(filePaths);
      }
    }
  } catch (storageError) {
    // Log do erro mas não falha a operação
    console.error("Erro ao deletar arquivos do storage:", storageError);
  }

  // Deletar usuário do Supabase Auth
  // Isso também irá deletar todos os dados relacionados via ON DELETE CASCADE
  // A função SQL também deleta arquivos do storage como backup
  const { error: deleteError } = await supabase.rpc("delete_user");

  if (deleteError) {
    // Se a RPC function não existir, tentar deletar via admin
    // Nota: Esta é uma operação privilegiada que precisa de configuração adicional
    return {
      success: false,
      error: "Erro ao deletar conta. Entre em contato com o suporte.",
    };
  }

  // Fazer logout após deletar
  await supabase.auth.signOut();
  redirect("/");
}
