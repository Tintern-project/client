// Environment configuration for the client
const config = {
  // API URL - use environment variable or default to the production URL
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://tintern-server.fly.dev',
  
  // Other configuration values can be added here
  appName: 'Tintern',
};

export default config;
