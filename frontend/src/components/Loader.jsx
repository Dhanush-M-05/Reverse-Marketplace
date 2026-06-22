export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="loader-full">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  )
}
