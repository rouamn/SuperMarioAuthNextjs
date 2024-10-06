import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";

import { session } from "next-auth/client";
export default function App({ Component, pageProps : { session, ...pageProps } }: AppProps){
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
