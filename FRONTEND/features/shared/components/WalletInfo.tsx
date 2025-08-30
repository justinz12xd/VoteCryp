"use client"

import React from "react"
type Props = {
  ensName?: string
  walletAddress?: string
}

export default function WalletInfo({ ensName = "", walletAddress = "" }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <div className="text-right">
        <div className="text-sm font-medium">{ensName}</div>
        <div className="text-xs text-muted-foreground">
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ""}
        </div>
      </div>
    </div>
  )
}
