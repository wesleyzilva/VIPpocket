/**
 * Login com Google usando Google Identity Services (GIS) carregado via <script>.
 * Zero dependências npm. Configure o Client ID em `GOOGLE_CLIENT_ID` abaixo.
 *
 * Como obter o Client ID:
 *  1. https://console.cloud.google.com/ → criar projeto
 *  2. APIs & Services → Credentials → Create credentials → OAuth client ID
 *  3. Application type: Web application
 *  4. Authorized JavaScript origins: http://localhost:4200 (e seu domínio prod)
 *  5. Copiar o "Client ID" para a constante abaixo (ou via build env)
 *
 * Se GOOGLE_CLIENT_ID estiver vazio, a UI esconde o botão e cai para cadastro manual.
 */

import { Injectable, signal } from '@angular/core';

export const GOOGLE_CLIENT_ID = ''; // ← cole seu Client ID OAuth aqui

export interface GoogleProfile {
  sub: string; // ID estável do usuário Google
  name: string;
  email: string;
  picture?: string;
  emailVerified: boolean;
}

interface GoogleCredentialResponse {
  credential: string; // JWT
}

declare const google: {
  accounts: {
    id: {
      initialize: (cfg: {
        client_id: string;
        callback: (r: GoogleCredentialResponse) => void;
      }) => void;
      prompt: () => void;
      renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
    };
  };
};

let scriptLoaded: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (scriptLoaded) return scriptLoaded;
  scriptLoaded = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Falha ao carregar Google Identity Services.'));
    document.head.appendChild(s);
  });
  return scriptLoaded;
}

function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const [, payload] = jwt.split('.');
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decodeURIComponent(escape(json)));
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  readonly enabled = signal(!!GOOGLE_CLIENT_ID);

  /**
   * Renderiza um botão "Continuar com Google" dentro do container fornecido.
   * Resolve com o perfil quando o usuário autenticar.
   */
  async signIn(container: HTMLElement): Promise<GoogleProfile> {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID não configurado. Edite src/app/shared/google-auth.ts.');
    }
    await loadGoogleScript();
    return new Promise<GoogleProfile>((resolve, reject) => {
      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            try {
              const payload = decodeJwtPayload(response.credential);
              resolve({
                sub: String(payload['sub']),
                name: String(payload['name'] ?? ''),
                email: String(payload['email'] ?? ''),
                picture: payload['picture'] ? String(payload['picture']) : undefined,
                emailVerified: payload['email_verified'] === true,
              });
            } catch (e) {
              reject(e);
            }
          },
        });
        google.accounts.id.renderButton(container, {
          theme: 'filled_blue',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: 320,
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
