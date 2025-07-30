import "bootstrap/dist/css/bootstrap.min.css"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next App with Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
