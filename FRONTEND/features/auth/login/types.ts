export interface LoginProps {
  // Optional redirect after a successful login
  redirectTo?: string;
  // Optional callback for host page
  onLogin?: (data: {
    address: string;
    ens?: string;
    cedula: string;
    fingerprintCode: string;
  }) => void;
}

export type LoginSession = {
  address: string;
  ens?: string;
  cedula: string;
  fingerprintCode: string;
};
