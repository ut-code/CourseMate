/** @type {import('next').NextConfig} */
const nextConfig = {
  // FIXME!! FIXME!!!!!! TODO!!! this hasn't even been enabled smh :/
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // fuck you
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
