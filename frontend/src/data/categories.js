export const categories = [
  { id: 'electronics', name: 'Electronics', icon: '💻', count: 1280 },
  { id: 'design', name: 'Design', icon: '🎨', count: 940 },
  { id: 'development', name: 'Development', icon: '⚙️', count: 1120 },
  { id: 'marketing', name: 'Marketing', icon: '📣', count: 610 },
  { id: 'writing', name: 'Writing', icon: '✍️', count: 430 },
  { id: 'services', name: 'Services', icon: '🛠️', count: 780 },
  { id: 'construction', name: 'Construction', icon: '🏗️', count: 290 },
  { id: 'events', name: 'Events', icon: '🎉', count: 350 },
  { id: 'vehicles', name: 'Vehicles', icon: '🚗', count: 420 },
  { id: 'study', name: 'Study', icon: '📚', count: 540 },
]

export const categoryName = (id) =>
  categories.find((c) => c.id === id)?.name || id
