import { useEffect, useState } from 'react'

type WalletState = {
  connected: boolean
  walletAddress?: string
  ensName?: string
}

export default function useWallet() {
  const [state, setState] = useState<WalletState>({ connected: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function fetchWallet() {
      try {
  const res = await fetch('/api/wallet')
        if (!res.ok) throw new Error('failed to fetch wallet')
        const data = await res.json()
        if (mounted) {
          setState({
            connected: Boolean(data.connected),
            walletAddress: data.walletAddress || '',
            ensName: data.ensName || '',
          })
        }
      } catch (_err) {
        if (mounted) {
          setState({ connected: false })
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchWallet()

    return () => {
      mounted = false
    }
  }, [])

  return { ...state, loading }
}
