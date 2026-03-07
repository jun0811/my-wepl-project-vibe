/**
 * Format number as Korean Won currency
 * @example formatCurrency(1500000) => "1,500,000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

/**
 * Format number as Korean Won with unit suffix
 * @example formatCurrencyWithUnit(15000000) => "1,500만원"
 */
export function formatCurrencyWithUnit(amount: number): string {
  if (amount >= 100_000_000) {
    const eok = amount / 100_000_000;
    return `${formatCurrency(Math.round(eok * 10) / 10)}억원`;
  }
  if (amount >= 10_000) {
    const man = amount / 10_000;
    return `${formatCurrency(Math.round(man))}만원`;
  }
  return `${formatCurrency(amount)}원`;
}

/**
 * Calculate percentage safely (returns 0 if total is 0)
 */
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

/**
 * Format date as Korean format
 * @example formatDate(new Date()) => "2026년 3월 6일"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

/**
 * Format date as short format
 * @example formatDateShort(new Date()) => "3.6 (목)"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[d.getDay()];
  return `${month}.${day} (${dayName})`;
}

/**
 * Calculate D-day from target date
 * @returns positive = days remaining, negative = days passed
 */
export function calculateDday(targetDate: Date | string): number {
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format D-day string
 * @example formatDday(100) => "D-100"
 * @example formatDday(0) => "D-Day"
 * @example formatDday(-3) => "D+3"
 */
export function formatDday(days: number): string {
  if (days > 0) return `D-${days}`;
  if (days === 0) return "D-Day";
  return `D+${Math.abs(days)}`;
}

/**
 * Sanitize avatar URL to prevent XSS via javascript:/data: protocols
 * Only allows https: URLs (and http: for localhost dev)
 */
export function safeAvatarUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return url;
    }
    return null;
  } catch {
    return null;
  }
}
