export function formatNumber(num: string | null | undefined): string {
  if (num == null) {
    return "N/A";
  }

  try {
    const value = Number(num);
    if (isNaN(value)) {
      return "N/A";
    }

    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`;
    } else {
      return value.toFixed(2);
    }
  } catch {
    return "N/A";
  }
}
