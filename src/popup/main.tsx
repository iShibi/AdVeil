import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Popup } from './Popup';

const { blurValue, fadeValue } = await chrome.storage.local.get<{ [key: string]: number | undefined }>([
	'blurValue',
	'fadeValue',
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Popup savedBlurValue={blurValue} savedFadeValue={fadeValue} />
	</StrictMode>,
);
