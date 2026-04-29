// 'use client'

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { useSearchParams } from "next/navigation";
// import api from "@/lib/api";

// export const dynamic = 'force-dynamic'

// function getApiErrorMessage(error: unknown) {
//   if (axios.isAxiosError(error)) {
//     const message = error.response?.data?.message;
//     if (Array.isArray(message)) {
//       return message.join(", ");
//     }
//     if (typeof message === "string" && message.trim().length > 0) {
//       return message;
//     }
//   }
//   return "Unable to verify email. Please try again.";
// }

// export default function VerifyEmailPage() {
//   const params = useSearchParams();
//   const token = params.get("token");
//   const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
//     "idle",
//   );
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (!token) {
//       return;
//     }

//     let cancelled = false;
//     const verify = async () => {
//       setStatus("loading");
//       try {
//         const response = await api.post("/auth/verify-email", null, {
//           params: { token },
//         });
//         if (cancelled) return;
//         setStatus("success");
//         setMessage(response.data?.message ?? "Email verified successfully.");
//       } catch (error) {
//         if (cancelled) return;
//         setStatus("error");
//         setMessage(getApiErrorMessage(error));
//       }
//     };

//     void verify();
//     return () => {
//       cancelled = true;
//     };
//   }, [token]);

//   return (
//     <main className="flex min-h-dvh items-center justify-center px-4 py-10">
//       <section className="w-full max-w-sm rounded-xl bg-card/50 p-6 text-center shadow-sm backdrop-blur-sm">
//         <h1 className="text-xl font-semibold">Email verification</h1>
//         <p className="mt-3 text-sm text-muted-foreground">
//           {!token
//             ? "Verification token is missing."
//             : status === "loading"
//               ? "Verifying your email..."
//               : message}
//         </p>

//         <div className="mt-6">
//           <Link
//             href="/auth"
//             className="inline-flex h-10 items-center justify-center rounded-lg bg-background px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
//           >
//             Go to sign in
//           </Link>
//         </div>
//       </section>
//     </main>
//   );
// }

'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";

function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message.trim().length > 0) return message;
  }
  return "Unable to verify email. Please try again.";
}

export default function VerifyEmailPage() {
  const params = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const t = params.get("token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(t);
  }, [params]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const verify = async () => {
      setStatus("loading");
      try {
        const response = await api.post("/auth/verify-email", null, {
          params: { token },
        });
        if (cancelled) return;
        setStatus("success");
        setMessage(response.data?.message ?? "Email verified successfully.");
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(getApiErrorMessage(error));
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <section className="w-full max-w-sm rounded-xl bg-card/50 p-6 text-center shadow-sm backdrop-blur-sm">
        <h1 className="text-xl font-semibold">Email verification</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          {!token
            ? "Verification token is missing."
            : status === "loading"
              ? "Verifying your email..."
              : message}
        </p>

        <div className="mt-6">
          <Link
            href="/auth"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-background px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Go to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}