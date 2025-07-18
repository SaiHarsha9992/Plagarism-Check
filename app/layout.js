
import "./globals.css";
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata = {
  title: "CloneCatcher",
  description: "CloneCatcher is a professional platform for detecting code plagiarism with accuracy and style.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
