import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";


const ppmori = localFont({
  src: '../public/fonts/PPMori/PPMori-SemiBold.otf',  
  variable: '--font-ppmori',
  weight: '300',
});

const jetbrains = localFont({
  src: '../public/fonts/JetBrainsMono/JetBrainsMono-Light.ttf',
  variable: '--font-jetbrains',
  weight: '300',
});
const Libre = localFont({
  src: '../public/fonts/LibreBaskerville/LibreBaskerville-Regular.ttf',
  variable: '--font-Libre',
  weight: '300',
});
const Hand=localFont({
  src: '../public/fonts/Hand/ArchitectsDaughter-Regular.ttf',
  variable: '--font-Hand',
  weight: '300',
});


export const metadata: Metadata = {
  title: "Lectroflow",
  description: "My wotrkflow management and automation website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ppmori.variable} ${jetbrains.variable} ${Libre.variable} ${Hand.variable} overflow-x-hidden no-scrollbar`}>
      <body className="h-screen max-h-screen flex flex-col lg:overflow-hidden">
        <header className="flex-none h-12 flex items-center bg-white z-[100]">
          <div className="absolute left-0">
            <Image
              src="/Black Outline Light.png"
              alt="Main logo"
              width={120}
              height={32}
              priority
              className="object-contain"
            />
          </div>
          <div className="absolute right-4 flex flex-row gap-2 items-center">
              <Link href="https://ypa.one" className="relative bg-black font-mono text-xs w-auto h-auto text-center p-2 backdrop-blur-0.5 border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_0_20px_rgba(0,0,0,0.4)] ring-1 ring-white/5 ring-inset rounded-md overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:bg-gray-500/50 hover:border-white/30 hover:backdrop-blur-xl hover:shadow-2xl hover:shadow-gray-500/20">
                Work With Me
              </Link>
            </div>
        </header>
        
        <main className="flex-1 bg-black lg:overflow-hidden">{children}</main>
        
      </body>
    </html>
  );
}