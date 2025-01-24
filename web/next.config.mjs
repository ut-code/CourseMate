/** @type {import('next').NextConfig} */
const nextConfig = {
  // FIXME!! FIXME!!!!!! TODO!!! you haven't even enabled it smh :/
  // delete the 4 lines below s.t. it doesn't build.
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
