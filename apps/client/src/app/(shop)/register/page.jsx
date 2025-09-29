// apps / client / src / app / shop / register / page.jsx;

"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleRegister = async ({ name, email, password }) => {
    const { success, error } = await register(name, email, password);
    if (success) {
      toast.success("Registration successful!");
      router.push("/");
    } else {
      toast.error(error || "Registration failed.");
    }
  };

  return (
    <AuthForm formType="register" onSubmit={handleRegister} loading={loading} />
  );
}
