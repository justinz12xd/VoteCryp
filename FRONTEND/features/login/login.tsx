"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Wallet, Network, Lock, Zap, Key, ArrowRight, Fingerprint } from "lucide-react"

// Mock admin addresses to align with existing views
const ADMIN_ADDRESSES = [
	"0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1",
	"admin.eth",
	"dao-admin.eth",
]

export interface LoginProps {
	// Optional redirect after a successful login
	redirectTo?: string
	// Optional callback for host page
	onLogin?: (data: { address: string; ens?: string; isAdmin: boolean; cedula: string; fingerprintCode: string }) => void
}

export default function Login({ redirectTo = "/", onLogin }: LoginProps) {
	const [ensName, setEnsName] = useState("")
	const [walletAddress, setWalletAddress] = useState("")
	const [connecting, setConnecting] = useState(false)
	const [isAdmin, setIsAdmin] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [connected, setConnected] = useState(false)

	// New fields
	const [cedula, setCedula] = useState("")
	const [fingerprintCode, setFingerprintCode] = useState("")

	const validateInputs = () => {
		const c = cedula.trim()
		const f = fingerprintCode.trim()

		if (!c || c.length < 6) return "Ingresa una cédula válida"
		if (!/^[0-9]+$/.test(c)) return "La cédula debe contener solo números"
		if (!f || f.length < 6) return "Ingresa un código dactilar válido"
		if (!/^[A-Za-z0-9-_.]+$/.test(f)) return "El código dactilar debe ser alfanumérico"
		return null
	}

	const connectWallet = async () => {
		const validationError = validateInputs()
		if (validationError) {
			setError(validationError)
			return
		}

		try {
			setConnecting(true)
			setError(null)
			// Simulación de conexión de wallet (reemplazar por wagmi/rainbowkit si aplica)
			await new Promise((r) => setTimeout(r, 1000))
			const mockAddress = "0x123456789abcdef123456789abcdef1234567890"
			const mockEns = ensName || "voter.eth"

			setWalletAddress(mockAddress)
			const admin = ADMIN_ADDRESSES.includes(mockAddress) || ADMIN_ADDRESSES.includes(mockEns)
					setIsAdmin(admin)
					setConnected(true)

					// Persist a lightweight session so the voting page can recognize login
					try {
						const session = { address: mockAddress, ens: mockEns, isAdmin: admin, cedula, fingerprintCode }
						window.localStorage.setItem("vc_session", JSON.stringify(session))
					} catch {
						// storage not available; continue without persistence
					}

					onLogin?.({ address: mockAddress, ens: mockEns, isAdmin: admin, cedula, fingerprintCode })

			// Redirección opcional tras conectar
			if (typeof window !== "undefined" && redirectTo) {
				// Dar un pequeño tiempo para que el usuario vea el estado
				setTimeout(() => {
					try {
						window.location.assign(redirectTo)
					} catch {
						// noop si no se puede redirigir (por ejemplo si es usado en un modal)
					}
				}, 600)
			}
		} catch (e) {
			setError("No se pudo conectar la wallet. Inténtalo de nuevo.")
		} finally {
			setConnecting(false)
		}
	}

	return (
		<div className="min-h-[70vh] sm:min-h-screen bg-background flex items-center justify-center px-4 py-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center space-y-4">
					<div className="flex justify-center">
						<Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
					</div>
					<div>
						<CardTitle className="text-xl sm:text-2xl">VoteCryp</CardTitle>
						<CardDescription className="text-sm sm:text-base mt-1">Inicia sesión para continuar</CardDescription>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{connected && (
						<Alert>
							<Shield className="h-4 w-4" />
							<AlertDescription className="text-sm">
								Conectado como {ensName || "usuario"}.{" "}
								{isAdmin && (
									<Badge variant="outline" className="ml-2 text-green-600">
										Admin Verificado
									</Badge>
								)}
							</AlertDescription>
						</Alert>
					)}

					{error && (
						<Alert>
							<AlertDescription className="text-sm">{error}</AlertDescription>
						</Alert>
					)}

					{/* New identity fields */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="cedula" className="text-sm">
								Cédula
							</Label>
							<Input
								id="cedula"
								inputMode="numeric"
								pattern="[0-9]*"
								placeholder="1234567890"
								autoComplete="off"
								value={cedula}
								onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
								className="text-sm"
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="finger" className="text-sm">
									Código dactilar
								</Label>
								<Fingerprint className="h-4 w-4 text-muted-foreground" />
							</div>
							<Input
								id="finger"
								placeholder="ABC1234"
								autoComplete="off"
								value={fingerprintCode}
								onChange={(e) => setFingerprintCode(e.target.value)}
								className="text-sm"
							/>
						</div>
						<p className="text-[11px] text-muted-foreground">
							Estos datos se usan solo para validar tu identidad.
						</p>
					</div>

					{/* ENS remains optional */}
					<div className="space-y-4">
						<Button onClick={connectWallet} className="w-full" size="lg" disabled={connecting}>
							{connecting ? (
								<>
									<Zap className="h-4 w-4 mr-2 animate-spin" />
									Conectando...
								</>
							) : (
								<>
									<Wallet className="h-4 w-4 mr-2" />
									Ingresar
								</>
							)}
						</Button>
					</div>
					{walletAddress && (
						<div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground border-t pt-4">
							<span>Wallet</span>
							<span className="font-medium">
								{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
							</span>
						</div>
					)}

					{!connected && (
						<div className="flex justify-end">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => (typeof window !== "undefined" ? window.location.assign("/") : undefined)}
							>
								Omitir e ir al portal
								<ArrowRight className="h-3.5 w-3.5 ml-2" />
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

