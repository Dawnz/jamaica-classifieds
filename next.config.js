// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       { protocol: "https", hostname: "res.cloudinary.com" },
//       { protocol: "https", hostname: "lh3.googleusercontent.com" },
//     ],
//   },
//   experimental: {
//     serverActions: true,
//   },
// };

// module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/api/auth/signin",
        destination: "/auth/signin",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
