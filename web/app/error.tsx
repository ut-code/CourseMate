"use client";

import Link from "next/link";

export default function ErrorPage() {
  return (
    <p>
      Sorry, an unexpected error has occurred. <Link href="/home">Go Back</Link>
    </p>
  );
}
