import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expert Storal AI - Assistant Personnalisé",
  description: "Configurez votre store idéal avec notre assistant intelligent",
};

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0b1d3a] via-[#10264c] to-[#173165]">
      {children}
    </div>
  );
}
