import { Helmet } from 'react-helmet-async';

/**
 * SEO Component
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.image - Social preview image URL
 * @param {string} props.url - Canonical URL
 */
export default function SEO({ 
  title = "Sundhar | Senior Product Designer Portfolio", 
  description = "Senior Product Designer with 7+ years of experience specializing in minimalist, functional design for B2B SaaS, EdTech, and Fintech.",
  image = "/og-image.png", // Ensure this exists in public/
  url = "https://sundhar88.github.io"
}) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Accessibility / Performance */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
