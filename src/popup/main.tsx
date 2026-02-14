import { render } from 'preact';
import type { LocalStorage } from '../types';
import { Popup } from './Popup';

const { blurValue, fadeValue, isPaused } = await chrome.storage.local.get<LocalStorage>([
	'blurValue',
	'fadeValue',
	'isPaused',
]);
document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);

render(
	<Popup savedBlurValue={blurValue} savedFadeValue={fadeValue} savedIsPausedValue={isPaused} />,
	document.getElementById('root')!,
);
