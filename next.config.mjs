/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/seed/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'cdn.jsdelivr.net',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
                pathname: '**'
            },
        ],

    }
};

export default nextConfig;
