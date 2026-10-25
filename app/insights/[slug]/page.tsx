import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleReader from '@/components/Insights/ArticleReader';
import {
  getArticleBySlug,
  getAuthor,
  getPublishedArticles,
} from '@/content/insights';
import { SITE_ORIGIN } from '@/lib/site';

export function generateStaticParams() {
  /* Drafts never become routes: only the published collection generates
     params, so a draft cannot be reached at its URL or indexed. */
  return getPublishedArticles().map((article) => ({
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

  if (!article || article.draft) {
    return {
      title: 'Article Not Found · Insights · SlideIn Venture',
    };
  }

  return {
    title: `${article.title} · Insights · SlideIn Venture`,
    description: article.excerpt,
    alternates: {
      // articleUrl is the article's own full canonical https URL.
      canonical: article.articleUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `${SITE_ORIGIN}/insights/${article.slug}`,
      type: 'article',
      publishedTime: article.date,
      ...(article.updatedAt ? { modifiedTime: article.updatedAt } : {}),
      authors: [getAuthor(article)],
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

  /* Drafts 404 even if someone guesses the slug: they are not published. */
  if (!article || article.draft) {
    notFound();
  }

  /* The "next" slot is wired but empty on purpose: with a single published
     article there is nothing to link to, and the reader renders no fake
     forward link. The newest published article that is not this one fills
     the slot the moment a second article ships. */
  const nextArticle = getPublishedArticles().find(
    (candidate) => candidate.slug !== article.slug,
  );

  return (
    <div>
      <ArticleReader article={article} nextArticle={nextArticle} />
    </div>
  );
}
