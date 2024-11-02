import "../../index.css";
import { ClientOnly } from "./client.tsx"; // TODO: remove file extension

export function generateStaticParams() {
  return [{ slug: [""] }];
}

export default function Page() {
  return <ClientOnly />;
}
