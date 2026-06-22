// Quotes are created at runtime by sellers and stored via DataContext.
export const quotes = []

// Quotes submitted by the logged-in seller (seller view) — runtime only.
export const sellerQuotes = []

export const quotesForRequirement = (reqId) =>
  quotes.filter((q) => q.requirementId === reqId)
