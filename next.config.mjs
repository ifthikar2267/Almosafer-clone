/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/stay", destination: "/", permanent: false }];
  },
};

export default nextConfig;
