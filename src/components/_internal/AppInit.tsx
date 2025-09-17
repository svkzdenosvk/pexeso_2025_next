'use client';

import { useImagePreloading } from '@pexeso/_inc/hooks/UseImagePreloading';
import { useAuthCheck } from '@pexeso/_inc/hooks/UseAuthCheck';

/**
 * AppInit Component
 *
 * A headless (UI-less) component used to initialize core app logic on mount.
 *
 * @responsibilities
 * - Executes authentication check via `useAuthCheck`.
 * - Preloads game images via `useImagePreloading`.
 *
 * @component
 * @example
 * <AppInit />
 *
 * @remarks
 * - This component has no visual output; it purely manages side effects.
 * - Runs on the client side only (`'use client'` directive).
 *
 * @dependencies
 * React, Redux, custom hooks (`useAuthCheck`, `useImagePreloading`)
 */

// ---------- Component

export default function AppInit() {
  // --- Step 1: Run authentication check on mount ---
  useAuthCheck();

  // --- Step 2: Preload required game images ---
  useImagePreloading();

  return null; // Component has no render output
}
