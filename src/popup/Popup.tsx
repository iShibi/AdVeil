import { useEffect, useState } from 'react';
import icon64 from '../../public/icon64.png';

interface PopupProps {
	savedBlurValue: number | undefined;
	savedFadeValue: number | undefined;
}

export function Popup({ savedBlurValue, savedFadeValue }: PopupProps) {
	const [blurValue, setBlurValue] = useState(savedBlurValue ?? 0);
	const [fadeValue, setFadeValue] = useState(savedFadeValue ?? 0);

	useEffect(() => {
		chrome.storage.local.set({ blurValue });
		document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
	}, [blurValue]);

	useEffect(() => {
		chrome.storage.local.set({ fadeValue });
		document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
	}, [fadeValue]);

	return (
		<div className="w-full h-full flex flex-col gap-y-6 select-none">
			<div className="flex flex-row pl-6 pt-4 items-center gap-x-2">
				<img src={icon64} alt="AdVeil-icon64" className="w-8 h-8" />
				<h1 className="text-lg font-extrabold font-mono">AdVeil</h1>
			</div>

			<div className="flex flex-col gap-y-5">
				<div className="flex flex-row justify-center">
					<div className="h-28 w-28 shadow-lg overflow-hidden rounded-full my-2 flex flex-row justify-center border-2 border-dashed border-stone-400">
						<button className="hover:cursor-pointer h-28 w-28 shadow-lg bg-green-500 rounded-full text-2xl blur-(--blur-value) opacity-(--opacity-value)">
							Preview
						</button>
					</div>
				</div>

				<div className="shadow-lg grid grid-cols-1 gap-y-4 text-sm mx-2 py-3 font-mono px-2 bg-stone-700 rounded-md">
					<label htmlFor="blur-value" className="flex flex-col gap-y-2">
						<div className="bg-stone-800 rounded-md px-2 py-1 w-fit shadow-md">
							<h1>Blur: {blurValue}</h1>
						</div>
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

					<label htmlFor="fade-value" className="flex flex-col gap-y-2">
						<div className="bg-stone-800 rounded-md px-2 py-1 w-fit shadow-md">
							<h1>Fade: {fadeValue}</h1>
						</div>
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
		</div>
	);
}
