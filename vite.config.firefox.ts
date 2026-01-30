import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

function copyManifestPlugin() {
	return {
		name: 'copy-manifest',
		async writeBundle() {
			const srcPath = resolve(__dirname, 'src/manifest.firefox.json'); // Source file in project root
			const destPath = resolve('dist/firefox/manifest.json'); // Target in dist/

			try {
				const content = await readFile(srcPath, 'utf8');
				await writeFile(destPath, content);
				console.log('dist/firefox/manifest.json');
			} catch (err) {
				console.error('Failed to copy manifest:', err);
			}
		},
	};
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(), copyManifestPlugin()],
	build: {
		outDir: 'dist/firefox',
		emptyOutDir: true,
		rollupOptions: {
			input: {
				popup: resolve(__dirname, 'src/popup/popup.html'),
				ServiceWorker: resolve(__dirname, 'src/ServiceWorker.ts'),
				Content: resolve(__dirname, 'src/Content.ts'),
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name].js',
			},
		},
	},
});
