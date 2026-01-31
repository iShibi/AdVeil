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
		<div className="w-full">
			<h1 className="text-2xl font-extrabold font-mono pb-5 px-2">AdVeil</h1>

			<div className="grid grid-cols-1 gap-y-2 text-base font-mono px-2">
				<label htmlFor="blur-value">
					<span>Blur: {blurValue}</span>
					<input
						type="range"
						name="blur-value"
						id="blur-value"
						min={0}
						max={100}
						value={blurValue}
						onChange={e => setBlurValue(parseInt(e.target.value))}
						className="w-full hover:cursor-pointer"
					/>
				</label>

				<label htmlFor="fade-value">
					<span>Fade: {fadeValue}</span>
					<input
						type="range"
						name="fade-value"
						id="fade-value"
						min={0}
						max={100}
						value={fadeValue}
						onChange={e => setFadeValue(parseInt(e.target.value))}
						className="w-full hover:cursor-pointer"
					/>
				</label>
			</div>
		</div>
	);
}
