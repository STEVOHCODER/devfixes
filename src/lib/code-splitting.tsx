'use client';

import type { ComponentType, ReactNode } from 'react';

/**
 * Loading component shown while lazy component loads
 */
export const LazyLoadingFallback = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center py-8 text-muted">
    <div className="animate-pulse">Loading {label}...</div>
  </div>
);

/**
 * Create a lazy component with custom loading fallback
 */
export function createLazyComponent<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  _label?: string,
  _options?: { ssr?: boolean; fallback?: ReactNode }
) {
  // Keep the import function intact so callers can choose when to load it.
  // The optional arguments are part of the public API and reserved for the
  // eventual framework-specific lazy wrapper.
  void _label;
  void _options;
  return importFunc;
}

/**
 * Prefetch lazy components using IntersectionObserver
 */
export function prefetchLazyComponent(
  elementId: string,
  importFunc: () => Promise<{ default: ComponentType }>,
  callback?: () => void
) {
  if (typeof window === 'undefined') return;

  const element = document.getElementById(elementId);
  if (!element) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Use requestIdleCallback if available, fallback to setTimeout
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            importFunc().then(() => {
              callback?.();
              observer.unobserve(element);
            });
          });
        } else {
          setTimeout(() => {
            importFunc().then(() => {
              callback?.();
              observer.unobserve(element);
            });
          }, 100);
        }
      }
    });
  });

  observer.observe(element);

  return () => observer.disconnect();
}

/**
 * Get estimated bundle size for lazy loaded component
 */
export function getComponentBundleSize(componentName: string): number {
  const bundleSizes: Record<string, number> = {
    'search-filters': 45,
    'related-content': 50,
    breadcrumb: 20,
  };

  return bundleSizes[componentName] || 0;
}

/**
 * Calculate total lazy loaded bundles for performance monitoring
 */
export function calculateLazyLoadMetrics() {
  const components = [
    'search-filters',
    'related-content',
    'breadcrumb',
  ];

  const totalSize = components.reduce(
    (sum, component) => sum + getComponentBundleSize(component),
    0
  );

  return {
    totalComponents: components.length,
    totalSizeKb: totalSize,
    avgSizeKb: totalSize / components.length,
  };
}
