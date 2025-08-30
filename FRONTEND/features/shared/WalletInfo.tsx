"use client"

import React from "react"

type Props = {
  ensName?: string
  // new canonical name
  sessionAddress?: string
  walletAddress?: string
}
export default function WalletInfo({ ensName = "", sessionAddress = "", walletAddress = "" }: Props) {
  return (
    <div className="flex items-center space-x-2" aria-live="polite" aria-atomic="true">
      <div className="text-right">
        <div className="text-sm font-medium">{ensName}</div>
        <div className="text-xs text-muted-foreground" title={(sessionAddress || walletAddress) ? `Session ${sessionAddress || walletAddress}` : "No session"}>
          {(sessionAddress || walletAddress) ? `${(sessionAddress || walletAddress).slice(0, 6)}...${(sessionAddress || walletAddress).slice(-4)}` : "Not connected"}
        </div>
      </div>
    </div>
  )
}
