/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  compilerOptions: {
    target: "es5",
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
