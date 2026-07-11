/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Disabled for WebRTC to avoid double renders
    images: {
        domains: ['images.unsplash.com'],
    },
};

export default nextConfig;
