import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export default async function SigninPage() {
  if (await getCurrentUser()) redirect("/dashboard");
  return <main className="noise grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-14"><AuthForm mode="signin" /></main>;
}
