"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/api";

type Mode = "signin" | "signup";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) {
      return message.join(", ");
    }
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }
  return "Something went wrong. Please try again.";
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const headerText = useMemo(() => {
    return mode === "signin" ? "Sign in" : "Sign up";
  }, [mode]);

  const subText = useMemo(() => {
    return mode === "signin"
      ? "Sign in to your account"
      : "Create your account to get started";
  }, [mode]);

  const validate = () => {
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }

    if (mode === "signup" && password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (mode === "signin" && password.trim().length === 0) {
      return "Please enter your password.";
    }

    return null;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        await api.post("/auth/register", { email, password });
        setSuccess(
          "Account created. Please check your email and verify your account before signing in.",
        );
        setMode("signin");
      } else {
        const response = await api.post("/auth/login", { email, password });
        const accessToken = response.data?.accessToken as string | undefined;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        }

        setSuccess("Signed in successfully. Redirecting...");
        router.push("/account");
      }
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onModeChange = (nextMode: Mode) => {
    setMode(nextMode);
    setError(null);
    setSuccess(null);
  };

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <section className="w-full max-w-sm rounded-xl bg-card/50 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-5 text-center">
          <p className="font-heading text-2xl italic">Women&apos;S</p>
        </div>

        <h1 className="text-xl font-semibold">{headerText}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subText}</p>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => onModeChange(mode === "signin" ? "signup" : "signin")}
            className="h-10 w-full rounded-lg bg-black text-sm font-semibold text-white transition hover:opacity-90"
          >
            Create an account
          </button>
        </div>

        <div className="my-3 text-center text-xs text-muted-foreground">or</div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring/40"
              disabled={isSubmitting}
            />
          </label>

          <label className="block">
            <span className="sr-only">Password</span>
            <input
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring/40"
              disabled={isSubmitting}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "signin"
                ? "Continue"
                : "Create account"}
          </button>
        </form>

        <label className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={subscribe}
            onChange={(event) => setSubscribe(event.target.checked)}
            className="size-4 rounded border-border"
            disabled={isSubmitting}
          />
          Email me with news and offers
        </label>

        {(error || success) && (
          <p
            className={`mt-3 text-xs ${error ? "text-red-600" : "text-emerald-700"}`}
            role={error ? "alert" : "status"}
          >
            {error ?? success}
          </p>
        )}

        <p className="mt-4 text-[11px] text-muted-foreground text-center">
          By continuing, you agree to our Terms of service.
        </p>
      </section>
    </main>
  );
}
