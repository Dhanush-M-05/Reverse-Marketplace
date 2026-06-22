// All marketplace data is created at runtime and stored in the browser via
// DataContext. These exports remain only as empty fallbacks/helpers.
export const requirements = []

export const myRequirementsFor = (userId) =>
  requirements.filter((r) => r.postedBy === userId)

export const requirementById = (id) =>
  requirements.find((r) => r.id === id)
