import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Video Lab',
  description: 'Developer lab for the How it works video player',
};

export default function VideoLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
