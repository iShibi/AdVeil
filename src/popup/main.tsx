import { render } from 'preact';
import type { LocalStorage } from '../types';
import { Popup } from './Popup';

const { blurValue, fadeValue, isPaused, grayscaleValue } = await chrome.storage.local.get<LocalStorage>([
	'blurValue',
	'fadeValue',
	'isPaused',
	'grayscaleValue',
]);
document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
document.documentElement.style.setProperty('--grayscale-value', `${grayscaleValue ?? 0}%`);

render(
	<Popup
		savedBlurValue={blurValue}
		savedFadeValue={fadeValue}
		savedIsPausedValue={isPaused}
		savedGrayscaleValue={grayscaleValue}
	/>,
	document.getElementById('root')!,
);
