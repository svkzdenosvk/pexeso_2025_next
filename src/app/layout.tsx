import type { Metadata } from "next";
import  Providers  from './providers';

export const metadata: Metadata = {
  title: "Pexeso in Next",
  description: "Pexeso game rewritten in Next",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="sk">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
