import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleReader from '@/components/Insights/ArticleReader';
import { ARTICLES, getArticleBySlug } from '@/content/insights';

export async function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found · Insights · SlideIn Venture',
    };
  }

  return {
    title: `${article.title} · Insights · SlideIn Venture`,
    description: article.excerpt,
    alternates: {
      canonical: `https://${article.articleUrl}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: ['Nasrullah Tanim'],
    },
  };
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <ArticleReader article={article} />
    </div>
  );
}
