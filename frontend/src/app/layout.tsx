// Root layout with providers

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="root-layout">{children}</div>;
}
