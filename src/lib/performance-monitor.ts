/**
 * Core Web Vitals metrics
 */
interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime?: number;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart?: number;
}

interface CumulativeLayoutShiftEntry extends PerformanceEntry {
  value?: number;
  hadRecentInput?: boolean;
}

interface ResourceMetric {
  name: string;
  duration: number;
  size: number;
}

export interface CoreWebVitals {
  lcp?: number; // Largest Contentful Paint (ms)
  fid?: number; // First Input Delay (ms)
  cls?: number; // Cumulative Layout Shift (0-1)
  ttfb?: number; // Time to First Byte (ms)
  fcp?: number; // First Contentful Paint (ms)
  inp?: number; // Interaction to Next Paint (ms)
}

/**
 * Page performance report
 */
export interface PerformanceReport {
  url: string;
  vitals: CoreWebVitals;
  loadTime: number;
  resourceCount: number;
  bundleSize: number;
  timestamp: number;
}

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private metrics: CoreWebVitals = {};
  private startTime: number = 0;
  private resources: PerformanceResourceTiming[] = [];

  /**
   * Initialize monitoring
   */
  init(): void {
    if (typeof window === "undefined") return;

    this.startTime = performance.now();

    // Measure LCP (Largest Contentful Paint)
    this.measureLCP();

    // Measure FID (First Input Delay)
    this.measureFID();

    // Measure CLS (Cumulative Layout Shift)
    this.measureCLS();

    // Measure TTFB (Time to First Byte)
    this.measureTTFB();

    // Measure resource timing
    this.measureResources();
  }

  /**
   * Measure LCP using PerformanceObserver
   */
  private measureLCP(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as LargestContentfulPaintEntry;
        this.metrics.lcp = Math.round(lastEntry.renderTime || lastEntry.startTime);
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });

      // Stop observing after 10 seconds (LCP metric stabilizes)
      setTimeout(() => observer.disconnect(), 10000);
    } catch {
      // PerformanceObserver not supported
    }
  }

  /**
   * Measure FID (First Input Delay)
   */
  private measureFID(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const firstEntry = entries[0] as FirstInputEntry;
          this.metrics.fid = Math.round((firstEntry.processingStart || 0) - firstEntry.startTime);
          observer.disconnect();
        }
      });

      observer.observe({ entryTypes: ["first-input"] });
    } catch {
      // PerformanceObserver not supported
    }
  }

  /**
   * Measure CLS (Cumulative Layout Shift)
   */
  private measureCLS(): void {
    if (!("PerformanceObserver" in window)) return;

    let clsValue = 0;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as CumulativeLayoutShiftEntry;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
            this.metrics.cls = Math.round(clsValue * 1000) / 1000;
          }
        }
      });

      observer.observe({ entryTypes: ["layout-shift"] });

      // Stop observing after page hide
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          observer.disconnect();
        }
      });
    } catch {
      // PerformanceObserver not supported
    }
  }

  /**
   * Measure TTFB (Time to First Byte)
   */
  private measureTTFB(): void {
    const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      this.metrics.ttfb = Math.round(navigationTiming.responseStart - navigationTiming.fetchStart);
    }
  }

  /**
   * Measure FCP (First Contentful Paint)
   */
  private measureFCP(): void {
    const paintEntries = performance.getEntriesByType("paint");
    const fcp = paintEntries.find((entry) => entry.name === "first-contentful-paint");
    if (fcp) {
      this.metrics.fcp = Math.round(fcp.startTime);
    }
  }

  /**
   * Measure resource timing
   */
  private measureResources(): void {
    this.resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  }

  /**
   * Get performance metrics
   */
  getMetrics(): CoreWebVitals {
    this.measureFCP();
    return this.metrics;
  }

  /**
   * Get resource timing breakdown
   */
  getResourceMetrics() {
    return {
      totalCount: this.resources.length,
      totalSize: this.resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      byType: this.resources.reduce(
        (acc, r) => {
          const type = r.initiatorType || "unknown";
          if (!acc[type]) acc[type] = [];
          acc[type].push({
            name: r.name,
            duration: Math.round(r.duration),
            size: r.transferSize || 0,
          });
          return acc;
        },
        {} as Record<string, ResourceMetric[]>
      ),
    };
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

    return {
      url: window.location.href,
      vitals: this.getMetrics(),
      loadTime: navigationTiming?.loadEventEnd - navigationTiming?.fetchStart || 0,
      resourceCount: this.resources.length,
      bundleSize: this.resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      timestamp: Date.now(),
    };
  }

  /**
   * Report metrics to external service
   */
  async reportMetrics(endpoint: string): Promise<void> {
    if (typeof window === "undefined") return;

    const report = this.generateReport();

    try {
      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, JSON.stringify(report));
      } else {
        await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify(report),
          headers: { "Content-Type": "application/json" },
          keepalive: true,
        });
      }
    } catch (error) {
      console.warn("Failed to report metrics:", error);
    }
  }
}

/**
 * Singleton instance
 */
let monitorInstance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
    if (typeof window !== "undefined") {
      monitorInstance.init();
    }
  }
  return monitorInstance;
}

/**
 * Performance thresholds for alerts
 */
export const performanceThresholds = {
  lcp: 2500, // ms - Good
  fid: 100, // ms - Good
  cls: 0.1, // - Good
  ttfb: 600, // ms - Good
  fcp: 1800, // ms - Good
};

/**
 * Check if metrics meet thresholds
 */
export function checkPerformanceThresholds(vitals: CoreWebVitals): Record<string, boolean> {
  return {
    lcp: !vitals.lcp || vitals.lcp <= performanceThresholds.lcp,
    fid: !vitals.fid || vitals.fid <= performanceThresholds.fid,
    cls: !vitals.cls || vitals.cls <= performanceThresholds.cls,
    ttfb: !vitals.ttfb || vitals.ttfb <= performanceThresholds.ttfb,
    fcp: !vitals.fcp || vitals.fcp <= performanceThresholds.fcp,
  };
}

/**
 * Format metrics for logging
 */
export function formatMetrics(vitals: CoreWebVitals): string {
  return `
Performance Metrics:
  LCP: ${vitals.lcp || "N/A"}ms
  FID: ${vitals.fid || "N/A"}ms
  CLS: ${vitals.cls || "N/A"}
  TTFB: ${vitals.ttfb || "N/A"}ms
  FCP: ${vitals.fcp || "N/A"}ms
  INP: ${vitals.inp || "N/A"}ms
  `.trim();
}
