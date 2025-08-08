import type { Metadata } from 'next';
import Providers from './providers'; // Global providers (Redux, i18n, MUI theme)
import ButtonLogReg from '@pexeso/components/LoginReg/ButtonLogReg'; // Top right login/register/logout buttons

/**
 * Root layout component for the entire Next.js application.
 *
 * Features:
 * - Defines static metadata (title & description)
 * - Wraps the app with global providers (Redux, i18n, MUI theme)
 * - Includes a global login/register/logout button component
 * - Sets up HTML structure with `<html>` and `<body>` tags
 *
 * @component
 * @layout
 * @remarks
 * All children passed to this component will be rendered inside the global context
 * @dependencies
 * Providers, ButtonLogReg, next/Metadata
 * @example
 * Used as the base layout in `app/layout.tsx`
 */

// ---------- Metadata
export const metadata: Metadata = {
  title: 'Pexeso in Next',
  description: 'Pexeso game rewritten in Next',
};


/**
 * RootLayout defines the outermost HTML structure and wraps children
 * in application-wide context (Redux, i18n, theme).
*/
// ---------- Component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // All nested content (pages/layouts/components)
}>) {
  return (
    <html lang="sk">
      <body>
        <Providers>
          {/* Top-right auth button block (register/login/logout) */}
          <ButtonLogReg />

          {/* Render actual page or child layout here */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
