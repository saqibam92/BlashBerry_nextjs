// apps / client / src / app / shop / login / page.jsx;
"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, loading } = useAuth();

  const redirectPath = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  const handleLogin = async ({ email, password }) => {
    const { success, error } = await login(email, password);
    if (success) {
      toast.success("Login successful!");
      router.push(redirectPath);
    } else {
      toast.error(error || "Login failed.");
    }
  };

  return <AuthForm formType="login" onSubmit={handleLogin} loading={loading} />;
}
