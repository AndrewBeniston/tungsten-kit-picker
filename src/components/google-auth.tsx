"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ErrorMessage } from "@/components/ui/error-message"

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token: string }) => void
            error_callback?: (error: { type: string; message: string }) => void
          }) => {
            requestAccessToken: () => void
          }
        }
      }
    }
    googleAuthClient?: {
      requestAccessToken: () => void
    }
  }
}

export function GoogleAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { isAuthenticated, signIn, signOut } = useAuth()

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      try {
        if (!window.google) {
          throw new Error('Google API not loaded')
        }

        if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
          throw new Error('Google Client ID not configured')
        }

        const client = await window.google.accounts.oauth2.initTokenClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          scope: [
            'https://www.googleapis.com/auth/spreadsheets.readonly',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
          ].join(' '),
          callback: (response) => {
            if (response.access_token) {
              signIn(response.access_token)
              setIsLoading(false)
              setError(null)
            }
          },
          error_callback: (error) => {
            console.error('Google Auth Error:', error)
            setError(new Error(error.message))
            setIsLoading(false)
          }
        })

        window.googleAuthClient = client
      } catch (error) {
        console.error('Error initializing Google Auth:', error)
        setError(error instanceof Error ? error : new Error('Failed to initialize Google Auth'))
        setIsLoading(false)
      }
    }

    initializeGoogleAuth()
  }, [signIn])

  const handleSignIn = () => {
    setIsLoading(true)
    setError(null)
    if (window.googleAuthClient) {
      window.googleAuthClient.requestAccessToken()
    } else {
      setError(new Error('Google Auth not initialized'))
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut()
    setError(null)
  }

  if (error) {
    return (
      <div className="space-y-2">
        <ErrorMessage error={error} />
        <Button
          variant="outline"
          onClick={() => setError(null)}
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={isAuthenticated ? handleSignOut : handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : isAuthenticated ? 'Sign Out' : 'Sign In with Google'}
    </Button>
  )
} 