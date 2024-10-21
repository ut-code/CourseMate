import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CourseMate",
  description: "CourseMate helps students to find friends",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
        <script type="module" src="/src/main.tsx">
          {children}
        </script>
      </body>
    </html>
  );
}
