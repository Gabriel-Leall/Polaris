import { ReactNode } from "react";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <html className="dark" lang="en">
      <body className="dark">{children}</body>
    </html>
  );
}
