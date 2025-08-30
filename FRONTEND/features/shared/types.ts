export type Candidate = {
  name: string
  votes?: number
  percentage?: number
  encryptedVotes?: string
}

export type Election = {
  id: number
  title: string
  description: string
  status: string
  startDate: string
  endDate: string
  totalVotes: number
  liskTxHash: string
  candidates: Candidate[]
}
