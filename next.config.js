/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // ❗️Permite compilar aunque haya errores de Typescript
    ignoreBuildErrors: true,
  },
  eslint: {
    // ❗️No corta el build si hay errores de ESLint
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
