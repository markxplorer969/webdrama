export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {children}
      </div>
    </div>
  );
}