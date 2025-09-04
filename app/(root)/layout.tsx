
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <main className="flex-1">{children}</main>;
}
