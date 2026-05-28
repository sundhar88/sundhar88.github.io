/**
 * OptimizedImage Component
 * Enforces alt text and encourages webp usage for performance.
 * 
 * @param {Object} props
 * @param {string} props.src - Image source (preferably .webp)
 * @param {string} props.alt - Mandatory descriptive alt text
 * @param {string} [props.className] - CSS class
 * @param {string} [props.width] - Image width
 * @param {string} [props.height] - Image height
 * @param {string} [props.loading] - lazy or eager
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  width, 
  height, 
  loading = "lazy",
  ...props 
}) {
  if (!alt) {
    console.error("OptimizedImage: 'alt' prop is mandatory for accessibility.");
  }

  const isWebp = src?.toLowerCase().endsWith('.webp');
  if (!isWebp && process.env.NODE_ENV === 'development') {
    console.warn(`OptimizedImage: Consider using .webp format for "${src}" to improve performance.`);
  }

  return (
    <img
      src={src}
      alt={alt || "Portfolio image"}
      className={className}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      {...props}
    />
  );
}
