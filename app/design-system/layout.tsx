import { notFound } from 'next/navigation';

/** Internal page: available while developing, a 404 on the live site. */
export default function InternalLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound();
  return <>{children}</>;
}
