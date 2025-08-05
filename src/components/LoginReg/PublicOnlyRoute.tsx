'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@pexeso/lib/redux/store/store'

/**
 * Public-only route wrapper that prevents logged-in users from accessing certain pages,
 * such as login or registration.
 *
 * Features:
 * - Automatically redirects authenticated users to the homepage
 * - Shows content only for unauthenticated (guest) users
 * - Can be used to protect public-only routes in Next.js
 *
 * @component
 * @example
 * <PublicOnlyRoute>
 *   <LoginForm />
 * </PublicOnlyRoute>
 *
 * @remarks
 * This component uses `next/navigation`, `react-redux`, and relies on
 * `auth.user` from the Redux store to determine authentication state.
 *
 * @dependencies
 * next/navigation, react-redux
 */

// ---------- Component

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user)
  const router = useRouter()

  // Redirect to the homepage if the user is logged in
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  // If user is authenticated, render nothing (could be shown a spinner here)
  if (user) return null 

  // Render children only for unauthenticated users
  return <>{children}</>
}

export default PublicOnlyRoute