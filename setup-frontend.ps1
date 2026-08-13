# setup-frontend.ps1
Write-Host "Creating frontend directories..." -ForegroundColor Green

$dirs = @(
    "frontend/src/components",
    "frontend/src/pages/Admin",
    "frontend/src/context",
    "frontend/src/services",
    "frontend/src/hooks",
    "frontend/src/utils",
    "frontend/src/i18n/locales",
    "frontend/public"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Path $d -Force | Out-Null }

Write-Host "Writing frontend files..." -ForegroundColor Green

# package.json
@"
{
  "name": "ahaa-emi-ruchi-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^4.12.0",
    "i18next": "^23.7.0",
    "react-i18next": "^13.5.0",
    "i18next-browser-languagedetector": "^7.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "vite-plugin-pwa": "^0.17.4"
  }
}
"@ | Out-File -FilePath "frontend/package.json" -Encoding utf8

# .env
@"
VITE_API_BASE=http://localhost:8000
VITE_RAZORPAY_KEY=rzp_test_xxxxx
"@ | Out-File -FilePath "frontend/.env" -Encoding utf8

# vite.config.ts
@"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Ahaa emi Ruchi',
        short_name: 'Ahaa Ruchi',
        description: 'Authentic Telugu home foods',
        theme_color: '#7a2e2a',
        background_color: '#fbf3e8',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
});
"@ | Out-File -FilePath "frontend/vite.config.ts" -Encoding utf8

# tailwind.config.js
@"
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'deep-maroon': '#7a2e2a',
        'terracotta': '#c65d47',
        'forest': '#2d5a3b',
        'warm-cream': '#fbf3e8',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  },
  plugins: []
};
"@ | Out-File -FilePath "frontend/tailwind.config.js" -Encoding utf8

# postcss.config.js
@"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@ | Out-File -FilePath "frontend/postcss.config.js" -Encoding utf8

# tsconfig.json
@"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
"@ | Out-File -FilePath "frontend/tsconfig.json" -Encoding utf8

# tsconfig.node.json
@"
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
"@ | Out-File -FilePath "frontend/tsconfig.node.json" -Encoding utf8

Write-Host "Frontend files created!" -ForegroundColor Green
Write-Host "Run: cd frontend; npm install" -ForegroundColor Yellow