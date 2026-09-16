"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Une erreur est survenue.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card w-full max-w-md p-7 md:p-9">
      <p className="label text-[#6c5ce7]">{signup ? "Nouveau départ" : "Heureux de vous revoir"}</p>
      <h1 className="mb-7 text-3xl font-black">{signup ? "Créez votre espace" : "Connectez-vous"}</h1>
      <div className="space-y-5">
        {signup && <label><span className="label">Votre nom</span><input className="input" name="name" required placeholder="Camille Martin" /></label>}
        <label><span className="label">Adresse e-mail</span><input className="input" name="email" type="email" required placeholder="vous@exemple.com" /></label>
        <label><span className="label">Mot de passe</span><input className="input" name="password" type="password" minLength={8} required placeholder="8 caractères minimum" /></label>
      </div>
      {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
      <button disabled={loading} className="btn btn-dark mt-7 w-full">
        {loading && <LoaderCircle className="animate-spin" size={18} />}
        {signup ? "Créer mon compte" : "Se connecter"}
      </button>
      <p className="mt-6 text-center text-sm text-black/55">
        {signup ? "Déjà un compte ?" : "Pas encore de compte ?"}{" "}
        <Link className="font-bold text-black underline" href={signup ? "/signin" : "/signup"}>{signup ? "Connexion" : "Inscription"}</Link>
      </p>
    </form>
  );
}
