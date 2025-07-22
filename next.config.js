/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push({
      message: /the request of a dependency is an expression/,
    });
    if (typeof config.webpack === 'function') {
      return config.webpack(config, { isServer });
    }
    return config;
  },
};

module.exports = nextConfig;
