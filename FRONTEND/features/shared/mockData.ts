import type { Election } from "./types";

export const mockElections: Election[] = [
  {
    id: 1,
    title: "Elección de Presidente DAO",
    description: "Votación para elegir el nuevo presidente de la organización",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-01-30",
    totalVotes: 1247,
    liskTxHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
    candidates: [
      {
        name: "Alice Johnson",
        votes: 523,
        percentage: 42,
        encryptedVotes: "zama_encrypted_523",
      },
      {
        name: "Bob Smith",
        votes: 412,
        percentage: 33,
        encryptedVotes: "zama_encrypted_412",
      },
      {
        name: "Carol Davis",
        votes: 312,
        percentage: 25,
        encryptedVotes: "zama_encrypted_312",
      },
    ],
  },
  {
    id: 2,
    title: "Propuesta de Mejoras",
    description: "Votación sobre implementación de nuevas características",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-01-14",
    totalVotes: 892,
    liskTxHash: "0x9876543210fedcba0987654321",
    candidates: [
      {
        name: "A favor",
        votes: 634,
        percentage: 71,
        encryptedVotes: "zama_encrypted_634",
      },
      {
        name: "En contra",
        votes: 258,
        percentage: 29,
        encryptedVotes: "zama_encrypted_258",
      },
    ],
  },
];
