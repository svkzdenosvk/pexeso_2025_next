'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@pexeso/lib/redux/store/store'

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user)
  const router = useRouter()

  // if user is logged in redirect to home page
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  // nothing to return if user is logged in
  if (user) return null // maybe spinnerin the future

  return <>{children}</>
}

export default PublicOnlyRoute