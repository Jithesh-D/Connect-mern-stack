// Utility to normalize tags coming from different sources
export function normalizeTags(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    // if looks like JSON array
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
      } catch (e) {
        // fall through to comma-split
      }
    }
    // comma separated or single tag
    return trimmed
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}
