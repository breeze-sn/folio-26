import { Helmet } from "react-helmet-async";

export default function Seo({ title, description, image, url, author, robots }) {
  const siteTitle = "Simran Nagekar — Game & Product Designer";
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description && <meta name="description" content={description} />}
      {author && <meta name="author" content={author} />}
      {robots && <meta name="robots" content={robots} />}

      {description && <meta property="og:title" content={pageTitle} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {description && <meta name="twitter:card" content="summary_large_image" />}
      {description && <meta name="twitter:title" content={pageTitle} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
