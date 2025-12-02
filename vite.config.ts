
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY for the browser
      // Using || "" ensures it doesn't print "undefined" into the code which can cause syntax errors
      // We check env.API_KEY (from loadEnv) AND process.env.API_KEY (system env) to ensure we catch Netlify's variables
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || "")
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    base: '/'
  };
});
