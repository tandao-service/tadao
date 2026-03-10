import TopProgressBar from "@/components/home/TopProgressBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-x-hidden">
<<<<<<< HEAD
      <TopProgressBar height={3} colorClassName="bg-orange-500" />
=======
>>>>>>> 874a1dfc95576a63fe83d03a1675763967327409
      {children}
    </main>
  );
}