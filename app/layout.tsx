import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes';
import { ModalProvider } from '@/components/modal-provider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Desiree',
  description: 'AI platform for generate whatever you desire',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider 
    appearance={{
      baseTheme: dark
    }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ModalProvider/>
          {children}
          </body>
      </html>
    </ClerkProvider>
  )
}
