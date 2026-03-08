/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@kembang/ui", "@kembang/api-client"],
  // Optional: Disable strict mode for speed during dev check if needed
  reactStrictMode: true,
};

module.exports = nextConfig;
