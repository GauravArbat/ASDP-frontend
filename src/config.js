// API Configuration
export const API_BASE_URL = 'https://asdp-banckend.onrender.com';

// Environment-based configuration
export const config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || API_BASE_URL,
  // Add other configuration options here
};
