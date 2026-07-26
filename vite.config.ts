import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from '@tailwindcss/vite'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'development' ? [codeInspectorPlugin({ bundler: 'vite', hotKeys: ['altKey'] })] : []),
    // navigator.share needs a secure context — https lets phones on the lan test the real share flow
    ...(process.env.HTTPS ? [basicSsl()] : []),
  ],
}))
