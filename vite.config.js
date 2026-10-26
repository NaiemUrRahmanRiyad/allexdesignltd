import { defineConfig } from 'vite';
import { localSeoRouting } from './scripts/local-seo-routing.mjs';
import { localContact } from './scripts/local-contact.mjs';
import { deploymentSettings } from './shared/deployment.js';
export default defineConfig({ plugins:[localContact(),localSeoRouting()], esbuild: { jsx: 'automatic' }, define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(deploymentSettings(process.env).origin) } });
