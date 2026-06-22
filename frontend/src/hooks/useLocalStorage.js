import { useEffect, useState } from 'react'
import { storage } from '../utils/storage'

// Persisted state synced to localStorage.
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => storage.get(key, initial))

  useEffect(() => {
    storage.set(key, value)
  }, [key, value])

  return [value, setValue]
}
