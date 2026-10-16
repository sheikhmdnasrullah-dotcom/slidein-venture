import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleReader from '@/components/Insights/ArticleReader';
import { getArticleBySlug } from '@/content/insights';

const SLUG = 'ai-pipeline-emas';

export async function generateMetadata(): Promise<Metadata> {
  const article = getArticleBySlug(SLUG);

  if (!article) {
    return {
      title: 'Article Not Found · SlideIn Venture',
    };
  }

  return {
    title: `${article.title} · SlideIn Venture`,
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

export default function DirectArticlePage() {
  const article = getArticleBySlug(SLUG);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <ArticleReader article={article} />
    </div>
  );
}
