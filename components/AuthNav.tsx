"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthNav() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex gap-4">
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>

        <Link href="/register">
          <Button>Register</Button>
        </Link>
      </div>
    );
  }

  return (
    <Button variant="destructive" onClick={() => signOut()}>
      Logout
    </Button>
  );
}
