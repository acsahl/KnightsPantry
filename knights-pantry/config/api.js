// API Configuration
// Change this to your computer's IP address when using Expo Go on physical device
// Use 'localhost' for iOS simulator
const API_BASE_URL = __DEV__ 
  ? 'http://172.20.10.2:4000'  // Your computer's IP for Expo Go
  : 'http://localhost:4000';   // For simulator

export default API_BASE_URL; 