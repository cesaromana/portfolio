/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PEER_SELF?: string;
  readonly VITE_HTTPS_PORT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
