/** @type {import('next').NextConfig} */

const ADMIN_ENDPOINT_BACKEND = 'https://326b-178-213-1-232.ngrok-free.app'
const DOMAIN = '326b-178-213-1-232.ngrok-free.app';

const nextConfig = {
  images: {
    domains: ['localhost', 'clumba-web-shop.vercel.app', 'i.pravatar.cc', 'd9zyg9-3001.csb.app', DOMAIN],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "poster-shop.joinposter.com",
        port: "",
        pathname: "/upload/**",
      },
      {
        protocol: "https",
        hostname: "ingredients.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      // {
      //   protocol: "http",
      //   hostname: "localhost:3001",
      //   port: "",
      //   pathname: "images/**",
      // },
    ],
  },
  env: {
    LIQPAY_PUBLIC: 'sandbox_i48537052364',
    LIQPAY_PRIVATE: 'sandbox_ChdqptB0uycfzyRv4L27m2A9ibndyJrKDxvDSTig',
    GOOGLE_API_KEY: 'AIzaSyAOgRCpjCpoIfNeyDL5CxW2nVt0hD1iexo',
    POSTER_API_ACCESS_TOKEN: '198381:78956798666468f0d7fde56893b15402',
    POSTER_API_URL: 'https://joinposter.com/api',
    // ADMIN_ENDPOINT_BACKEND: 'https://flowers-shop-backend.onrender.com'
    // ADMIN_ENDPOINT_BACKEND: 'http://localhost:3001'
    // ADMIN_ENDPOINT_BACKEND: 'http://16.171.242.251:3001'
    ADMIN_ENDPOINT_BACKEND: ADMIN_ENDPOINT_BACKEND
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin allow-popups",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
