'use client'
import { useEffect, useState } from 'react'
import { useSession, useUser } from '@clerk/nextjs'
import { createBrowserClient } from "@supabase/ssr";

// The `useUser()` hook will be used to ensure that Clerk has loaded data about the logged in user
const { user } = useUser()
// The `useSession()` hook will be used to get the Clerk session object
const { session } = useSession()

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        // Get the custom Supabase token from Clerk
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({
            template: 'supabase',
          })

          // Insert the Clerk Supabase token into the headers
          const headers = new Headers(options?.headers)
          headers.set('Authorization', `Bearer ${clerkToken}`)

          // Now call the default fetch
          return fetch(url, {
            ...options,
            headers,
          })
        },
      },
    },
  )