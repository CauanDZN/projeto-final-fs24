import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/authContext";
import "./globals.css";
import { Slide, ToastContainer } from "react-toastify";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Digital Bio",
  description: "Link Tree",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <AuthProvider>
        <body className={inter.className}>
        <main className="flex justify-center h-screen w-screen">
          {children}
        </main>

        </body>
      </AuthProvider>
    </html>
  );
}
