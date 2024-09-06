/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  redirects: () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
