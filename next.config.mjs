/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sqlite3', 'bcryptjs'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
