/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.json'
    // ignoreBuildErrors: true
  },
  images: {
    domains: ['utfs.io']
  },
  redirects: () => {
    return [
      {
        source: '/',
        destination: '/nav',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
