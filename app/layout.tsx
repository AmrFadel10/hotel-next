import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { Toaster } from "react-hot-toast";
import prisma from "@/utils/db";
import { User } from "@prisma/client";
import { verifyToken } from "@/utils/verifyToken";
import Footer from "@/components/Footer";

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});
export const metadata: Metadata = {
  title: "AF | Hotel reservation",
  description: "you can reserve room in out hotels.",
  icons: "/favicon.png",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const checkUser = verifyToken();
  let user;
  if (checkUser) {
    user = (await prisma.user.findUnique({
      where: { id: checkUser.userId },
    })) as User;
  }

  return (
    <html lang="en">
      <body className={`${cairo.className}  flex flex-col min-h-screen`}>
        <Toaster />
        <Header user={user} />

        <main className="container mx-auto py-6 px-2 md:px-0 flex-1 flex">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
