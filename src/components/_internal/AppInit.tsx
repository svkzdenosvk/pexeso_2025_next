'use client';

import { useImagePreloading } from "@pexeso/_inc/hooks/UseImagePreloading";
import { useAuthCheck } from "@pexeso/_inc/hooks/UseAuthCheck";


/**
 * AppInit Component
 *
 * A headless (UI-less) component used to initialize core app logic on mount.
 *
 * @responsibilities
 * - Runs client-side authentication check (`useAuthCheck`)
 *   - Verifies login status via `/api/auth/me`
 *   - Applies origin protection against unauthorized domains
 * - Preloads game assets at startup (`useImagePreloading`)
 *   - Ensures all required images are cached before gameplay
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
 * React, Redux, fetch API, custom hooks (`useAuthCheck`, `useImagePreloading`)
 */

// ---------- Component

export default function AppInit() {
 
    // Run auth check once on mount
    useAuthCheck();
 
    // Preload game images while loading flag is active
    useImagePreloading();

  return null; // This component renders nothing
}
