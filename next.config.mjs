/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  // Configure webpack for serverless deployment
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // Mark mysql2 as external to include in serverless bundle
      config.externals = [...config.externals, 'mysql2'];
    }
    return config;
  },
  // Transpile specific packages if needed
  transpilePackages: [],
};

export default nextConfig;
