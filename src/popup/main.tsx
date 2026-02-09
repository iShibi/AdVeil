import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { LocalStorage } from '../Content';
import { Popup } from './Popup';

const { blurValue, fadeValue, isPaused } = await chrome.storage.local.get<LocalStorage>([
	'blurValue',
	'fadeValue',
	'isPaused',
]);
document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Popup savedBlurValue={blurValue} savedFadeValue={fadeValue} savedIsPausedValue={isPaused} />
	</StrictMode>,
);
