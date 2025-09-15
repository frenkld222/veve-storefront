import "./globals.css";

export const metadata = {
  title: "VEVE Chocolat — Luxury Dark That Tastes Like Milk",
  description: "Shop VEVE premium dark chocolate with a milk-like finish.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
