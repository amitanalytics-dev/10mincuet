"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "./auth";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/auth/signin");
    }
  }, [router]);
}
