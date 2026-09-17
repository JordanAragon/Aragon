/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/JordanAragon/Aragon/main/img/**',
      },
    ],
  },
};

export default nextConfig;
