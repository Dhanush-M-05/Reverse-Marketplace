// Orders are created at runtime when a buyer accepts a quote (DataContext).
export const orders = []

export const ORDER_STATUSES = ['pending', 'accepted', 'in_progress', 'delivered', 'completed', 'cancelled']

export const statusMeta = {
  pending: { label: 'Pending', cls: 'badge-warning' },
  accepted: { label: 'Accepted', cls: 'badge-info' },
  in_progress: { label: 'In Progress', cls: 'badge-brand' },
  delivered: { label: 'Delivered', cls: 'badge-success' },
  completed: { label: 'Completed', cls: 'badge-success' },
  cancelled: { label: 'Cancelled', cls: 'badge-danger' },
  open: { label: 'Open', cls: 'badge-success' },
  shortlisted: { label: 'Shortlisted', cls: 'badge-info' },
  rejected: { label: 'Rejected', cls: 'badge-danger' },
  active: { label: 'Active', cls: 'badge-success' },
  inactive: { label: 'Inactive', cls: 'badge-danger' },
  resolved: { label: 'Resolved', cls: 'badge-success' },
}
