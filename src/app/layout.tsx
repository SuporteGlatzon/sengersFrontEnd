import { Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import 'react-loading-skeleton/dist/skeleton.css';
import '../assets/globals.css';

import AuthProvider from '../components/auth-provider';
import { SessionManager } from './(auth)/SessionManager';

const darkenGrotesque = Space_Grotesk({ subsets: ['latin'] });

export const metadata = {
  title: 'Conexões Engenharia',
  description: 'O portal de oportunidades do SENGE RS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR'>
      <head>
        <meta
          name='adopt-website-id'
          content='dfa794e3-44db-495c-a3a5-920c9b3e674c'
        />
        <Script
          src='//tag.goadopt.io/injector.js?website_code=dfa794e3-44db-495c-a3a5-920c9b3e674c'
          strategy='afterInteractive'
          className='adopt-injector'
        />
      </head>
      <body
        className={`${darkenGrotesque.className} bg-stone-100 flex flex-col text-stone-800`}
      >
        <Toaster
          position='top-right'
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
            },
            success: {
              icon: '👏',
              style: {
                background: '#fff',
                color: '#0d4a46',
              },
              iconTheme: {
                primary: '#0d4a46',
                secondary: 'black',
              },
            },
            error: {
              icon: '😕',
              style: {
                background: '#fff',
                color: '#EF4444',
              },
            },
          }}
        />
        <AuthProvider>
          {children}
          <SessionManager />
        </AuthProvider>
      </body>
    </html>
  );
}
