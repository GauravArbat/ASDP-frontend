// API Configuration
export const API_BASE_URL = 'https://asdp-banckend.onrender.com';

// Environment-based configuration
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || API_BASE_URL,
  // Add other configuration options here
};
