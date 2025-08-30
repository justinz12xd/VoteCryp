"use client"

import React from "react"
type Props = {
  ensName?: string
  walletAddress?: string
}

export default function WalletInfo({ ensName = "", walletAddress = "" }: Props) {
  return (
    <div className="flex items-center space-x-2" aria-live="polite" aria-atomic="true">
      <div className="text-right">
        {/* Provide a visible name and a short accessible label for screen readers */}
        <div className="text-sm font-medium">{ensName}</div>
        <div className="text-xs text-muted-foreground" title={walletAddress ? `Wallet ${walletAddress}` : "No wallet connected"}>
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Not connected"}
        </div>
      </div>
    </div>
  )
}
