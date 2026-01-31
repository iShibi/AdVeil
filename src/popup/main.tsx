import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { LocalStorage } from '../Content';
import { Popup } from './Popup';

const { blurValue, fadeValue } = await chrome.storage.local.get<LocalStorage>(['blurValue', 'fadeValue']);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Popup savedBlurValue={blurValue} savedFadeValue={fadeValue} />
	</StrictMode>,
);
