import "../../index.css";
import { ClientOnly } from "./client";

export function generateStaticParams() {
  return [
    { slug: [] }, // Root path ("/")
    { slug: ["login"] }, // "/login"
  ];
}

export default function Page() {
  return <ClientOnly />;
}
