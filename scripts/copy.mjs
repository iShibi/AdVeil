#!/usr/bin/env zx

import path from 'path';
import { fs } from 'zx';

const sourceDir = path.join(__dirname, '..', 'src');

for (const browser of ['chrome', 'firefox']) {
	const destinationDir = path.join(__dirname, '..', `dist/${browser}`);
	await fs.mkdir(destinationDir, { recursive: true });
	const files = (await fs.readdir(sourceDir)).filter(file => !file.endsWith('.ts') && file !== 'input.css');
	for (const file of files) {
		if (file.includes('manifest')) {
			if (file.includes(browser)) {
				const sourceFilePath = path.join(sourceDir, file);
				const destinationFilePath = path.join(destinationDir, 'manifest.json');
				await fs.copyFile(sourceFilePath, destinationFilePath);
				console.log(`Copied: manifest.json`);
			} else {
				continue;
			}
		} else {
			const sourceFilePath = path.join(sourceDir, file);
			const destinationFilePath = path.join(destinationDir, file);
			await fs.copyFile(sourceFilePath, destinationFilePath);
			console.log(`Copied: ${file}`);
		}
	}
}
