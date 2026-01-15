/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.notion.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Bundle analyzer (uncomment to analyze bundle)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
};

export default nextConfig;
