import { initials } from '../utils/format'

export default function Avatar({ name = '', src, size = '' }) {
  const cls = size ? `avatar avatar-${size}` : 'avatar'
  return (
    <span className={cls} aria-hidden>
      {src ? <img src={src} alt={name} /> : initials(name) || '?'}
    </span>
  )
}
