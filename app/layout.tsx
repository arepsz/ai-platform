import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes';
import { ModalProvider } from '@/components/modal-provider';
import { ToasterProvider } from '@/components/toaster-provider';
import { CrispProvider } from '@/components/crisp-provider';

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
        <CrispProvider />
        <body className={inter.className}>
          <ModalProvider/>
          <ToasterProvider />
          {children}
          </body>
      </html>
    </ClerkProvider>
  )
}
