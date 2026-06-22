import { FiMoon, FiSun } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'inline-flex' }}
      >
        {theme === 'light' ? <FiMoon /> : <FiSun />}
      </motion.span>
    </button>
  )
}
