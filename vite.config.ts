
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  const getEnvVar = (key: string) => {
    return JSON.stringify(env[key] || process.env[key] || "");
  };

  return {
    plugins: [react()],
    define: {
      // Frontend no longer needs API_KEY (Moved to Backend)
      // We keep Google Sheets URL for the form submission
      'process.env.GOOGLE_SHEETS_URL': getEnvVar('GOOGLE_SHEETS_URL')
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    base: '/'
  };
});