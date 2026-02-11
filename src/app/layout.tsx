import 'tailwindcss/tailwind.css'
import '../components/css/index.css'
import Header from '../components/Header.tsx'
import Footer from '../components/Footer.tsx'
import StoreProvider from './StoreProvider.tsx'
import { NextAuthProvider } from '../components/Auth/SessionWrapper.tsx'
import InitCart from '../components/InitCart/index.tsx'
export const metadata = {
  title: "BluE-Commerce",
  description: "Hello hey!",
};
export default function RootLayout({ children }: { children: React.ReactElement }) {

  console.log("Entry file executed!");
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body className='relative w-[100vw] '>
        <NextAuthProvider>
          {/* <BackgroundImage /> */}
          <StoreProvider>
            <InitCart />
            <Header />
            <main className='w-[100vw] min-h-[78vh] border-t-1'>
              {children}
            </main>
            <Footer />
          </StoreProvider>
        </NextAuthProvider>
      </body>
    </html >
  );
}
