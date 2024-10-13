// next.config.mjs
export default {
  async rewrites() {
    return [
      {
        source: '/multiply',
        destination: '/api/multiply',
      },
      {
        source: '/metrics',
        destination: '/api/metrics',
      },
      {
        source: '/',
        destination: '/api/index',
      },
    ];
  },
};
