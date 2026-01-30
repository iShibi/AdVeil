import { useEffect, useState } from 'react';

interface PopupProps {
	savedBlurValue: number | undefined;
	savedFadeValue: number | undefined;
}

export function Popup({ savedBlurValue, savedFadeValue }: PopupProps) {
	const [blurValue, setBlurValue] = useState(savedBlurValue ?? 0);
	const [fadeValue, setFadeValue] = useState(savedFadeValue ?? 0);

	useEffect(() => {
		chrome.storage.local.set({ blurValue });
	}, [blurValue]);

	useEffect(() => {
		chrome.storage.local.set({ fadeValue });
	}, [fadeValue]);

	return (
		<div>
			<h1 className="text-2xl font-extrabold font-mono">AdVeil</h1>
			<div className="flex flex-row gap-x-2">
				<label htmlFor="blur-value">Blur:</label>
				<input
					type="range"
					name="blur-value"
					id="blur-value"
					min={0}
					max={100}
					value={blurValue}
					onChange={e => setBlurValue(parseInt(e.target.value))}
				/>
			</div>
			<h1>{blurValue}</h1>
			<div className="flex flex-row gap-x-2">
				<label htmlFor="fade-value">Fade:</label>
				<input
					type="range"
					name="fade-value"
					id="fade-value"
					min={0}
					max={100}
					value={fadeValue}
					onChange={e => setFadeValue(parseInt(e.target.value))}
				/>
			</div>
			<h1>{fadeValue}</h1>
		</div>
	);
}
