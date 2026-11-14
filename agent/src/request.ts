/** A request as typed, reduced so that small differences (spaces, case, end punctuation) still match. */
export function normalizeRequest(text: string) {
  return text.replace(/\s+/g, " ").trim().replace(/[。.!！?？~～\s]+$/, "").toLowerCase();
}
