import { useEffect, useState } from 'react'
import { getStatus } from './hours'

// Open/closed status that refreshes every 30 seconds.
export function useStatus() {
  const [status, setStatus] = useState(() => getStatus())
  useEffect(() => {
    const t = setInterval(() => setStatus(getStatus()), 30000)
    return () => clearInterval(t)
  }, [])
  return status
}
