
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 overflow-x-hidden">
      {children}
    </main>
  );
}