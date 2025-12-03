
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third argument '' loads all env vars, including system ones like API_KEY from Netlify
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Safe accessor for variables
  const getEnvVar = (key: string) => {
    return JSON.stringify(env[key] || process.env[key] || "");
  };

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env for the browser
      // We prioritize env.API_KEY (loaded from Netlify context)
      'process.env.API_KEY': getEnvVar('API_KEY'),
      'process.env.GOOGLE_SHEETS_URL': getEnvVar('GOOGLE_SHEETS_URL')
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    base: '/'
  };
});
