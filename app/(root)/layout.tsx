import TopProgressBar from "@/components/home/TopProgressBar";
import { AuthProvider } from "../hooks/useAuth";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-x-hidden">
      <TopProgressBar height={3} colorClassName="bg-orange-500" />
      <AuthProvider>{children}</AuthProvider>
    </main>
  );
}