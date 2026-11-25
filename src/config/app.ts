interface AppConfig {
  name: string;
  version: string;
  description: string;
  author: string;
  repository: string;
}

export const APP_CONFIG: AppConfig = {
  name: import.meta.env.VITE_APP_NAME || 'frontend-project',
  version: '1.0.0',
  description: 'A scalable React frontend template with TypeScript and Tailwind CSS',
  author: 'Your Name',
  repository: 'https://github.com/acheevo/frontend-project',
};

export default APP_CONFIG;
