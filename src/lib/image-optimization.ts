import type { CSSProperties } from "react";

/**
 * Image optimization metadata
 */
export interface OptimizedImageConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  format?: "webp" | "png" | "jpeg";
  blurDataUrl?: string;
  className?: string;
}

/**
 * Generate blur placeholder data URL for images
 * Uses a simple SVG blur placeholder
 */
export function generateBlurDataUrl(
  width: number,
  height: number,
  color: string = "#e5e7eb"
): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'><filter id='b'><feGaussianBlur stdDeviation='20'/></filter><rect fill='${color}' width='${width}' height='${height}' filter='url(%23b)'/></svg>`;
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get responsive image srcset with multiple resolutions
 */
export function getResponsiveSrcSet(
  basePath: string,
  fileName: string,
  widths: number[] = [320, 640, 1024, 1280, 1920]
): string {
  return widths
    .map((width) => `${basePath}/${fileName}?w=${width} ${width}w`)
    .join(", ");
}

/**
 * Get optimized image sizes attribute for responsive images
 */
export function getImageSizes(
  breakpoints: { mobile: string; tablet: string; desktop: string } = {
    mobile: "100vw",
    tablet: "100vw",
    desktop: "100vw",
  }
): string {
  return `(max-width: 640px) ${breakpoints.mobile}, (max-width: 1024px) ${breakpoints.tablet}, ${breakpoints.desktop}`;
}

/**
 * Calculate aspect ratio for CSS
 */
export function getAspectRatioPadding(width: number, height: number): CSSProperties {
  return {
    paddingBottom: `${(height / width) * 100}%`,
  };
}

/**
 * Image optimization presets for different use cases
 */
export const imagePresets = {
  heroImage: {
    quality: 85,
    sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px",
    priority: true,
  } as Partial<OptimizedImageConfig>,
  articleImage: {
    quality: 80,
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 85vw, 800px",
    priority: false,
  } as Partial<OptimizedImageConfig>,
  thumbnail: {
    quality: 75,
    sizes: "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
    priority: false,
  } as Partial<OptimizedImageConfig>,
  icon: {
    quality: 90,
    sizes: "64px",
    priority: false,
  } as Partial<OptimizedImageConfig>,
  background: {
    quality: 70,
    sizes: "100vw",
    priority: false,
  } as Partial<OptimizedImageConfig>,
};

/**
 * Check if an image should use WebP format
 */
export function supportsWebP(): boolean {
  if (typeof window === "undefined") return false;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp") !== canvas.toDataURL("image/png");
}

/**
 * Get optimal format based on browser support
 */
export function getOptimalFormat(preferredFormat: "webp" | "png" | "jpeg" = "webp"): "webp" | "png" | "jpeg" {
  if (typeof window === "undefined") return preferredFormat;
  if (preferredFormat === "webp" && supportsWebP()) return "webp";
  return "jpeg";
}

/**
 * Image optimization stats for monitoring
 */
export interface ImageOptimizationStats {
  originalSize: number;
  optimizedSize: number;
  format: string;
  quality: number;
  reduction: number;
}

/**
 * Calculate compression stats
 */
export function calculateCompressionStats(
  originalSize: number,
  optimizedSize: number,
  format: string,
  quality: number
): ImageOptimizationStats {
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
  return {
    originalSize,
    optimizedSize,
    format,
    quality,
    reduction: Math.round(reduction),
  };
}
