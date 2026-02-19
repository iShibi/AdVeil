import { useEffect, useState } from 'preact/hooks';
import iconOff64 from '../../public/icon-off-64.png';
import iconOn64 from '../../public/icon-on-64.png';
import { GithubIcon, PauseIcon, ResumeIcon, TwitterIcon } from '../icons';
import type { LocalStorage } from '../types';
import { setIcon } from '../utils';

interface PopupProps {
	savedBlurValue: number | undefined;
	savedFadeValue: number | undefined;
	savedIsPausedValue: boolean | undefined;
	savedGrayscaleValue: number | undefined;
}

export function Popup({ savedBlurValue, savedFadeValue, savedIsPausedValue, savedGrayscaleValue }: PopupProps) {
	const [blurValue, setBlurValue] = useState(savedBlurValue ?? 0);
	const [fadeValue, setFadeValue] = useState(savedFadeValue ?? 0);
	const [isPaused, setIsPaused] = useState(savedIsPausedValue ?? false);
	const [grayscaleValue, setGrayscaleValue] = useState(savedGrayscaleValue ?? 0);

	useEffect(() => {
		chrome.storage.local.set({ blurValue });
		document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
	}, [blurValue]);

	useEffect(() => {
		chrome.storage.local.set({ fadeValue });
		document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
	}, [fadeValue]);

	useEffect(() => {
		chrome.storage.local.set({ grayscaleValue });
		document.documentElement.style.setProperty('--grayscale-value', `${grayscaleValue ?? 0}%`);
	}, [grayscaleValue]);

	useEffect(() => {
		chrome.storage.local.set({ isPaused });
		if (isPaused) {
			document.documentElement.style.setProperty('--blur-value', '0px');
			document.documentElement.style.setProperty('--opacity-value', '100%');
			setIcon('off');
		} else {
			const setCSSVars = async () => {
				const { blurValue, fadeValue } = await chrome.storage.local.get<LocalStorage>(['blurValue', 'fadeValue']);
				document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
				document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
			};
			setCSSVars();
			setIcon('on');
		}
	}, [isPaused]);

	return (
		<div className='flex h-full w-full flex-col gap-y-6 select-none'>
			<div className='flex flex-row items-center justify-between px-6 pt-4'>
				<div className='flex flex-row items-center gap-x-2'>
					<img src={isPaused ? iconOff64 : iconOn64} alt='AdVeil Icon' className='h-6 w-6' />
					<h1 className='font-mono text-lg font-extrabold'>AdVeil</h1>
				</div>
				<div className='flex flex-row items-center gap-x-2'>
					<button
						type='button'
						title={isPaused ? 'Resume AdVeil Extension' : 'Pause AdVeil Extension'}
						onClick={() => setIsPaused(!isPaused)}
						className='hover:cursor-pointer'
					>
						{isPaused ? <ResumeIcon /> : <PauseIcon />}
					</button>
				</div>
			</div>

			<div className='flex flex-col gap-y-5'>
				<div className='flex flex-row justify-center'>
					<div
						className={`my-2 flex h-28 w-28 flex-row justify-center overflow-hidden rounded-full border-2 border-dashed shadow-lg ${isPaused ? 'border-stone-400' : 'border-green-400'} transition duration-300 ease-out`}
					>
						<button
							type='button'
							className={`h-28 w-28 rounded-full text-2xl opacity-(--opacity-value) shadow-lg blur-(--blur-value) grayscale-(--grayscale-value) hover:cursor-pointer ${isPaused ? 'bg-stone-400' : 'bg-green-400 text-stone-800'} transition duration-300 ease-out`}
						>
							Preview
						</button>
					</div>
				</div>

				<div className='mx-2 grid grid-cols-1 gap-y-4 rounded-md bg-stone-700 px-2 py-3 font-mono text-sm shadow-lg'>
					<label htmlFor='blur-value' className='flex flex-col gap-y-2'>
						<div className='w-fit rounded-md bg-stone-800 px-2 py-1 shadow-md'>
							<h1>Blur: {blurValue}</h1>
						</div>
						<input
							type='range'
							name='blur-value'
							id='blur-value'
							min={0}
							max={100}
							value={blurValue}
							disabled={isPaused}
							onInput={e => setBlurValue(parseInt(e.currentTarget.value, 10))}
							className={`w-full ${isPaused ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
						/>
					</label>

					<label htmlFor='fade-value' className='flex flex-col gap-y-2'>
						<div className='w-fit rounded-md bg-stone-800 px-2 py-1 shadow-md'>
							<h1>Fade: {fadeValue}</h1>
						</div>
						<input
							type='range'
							name='fade-value'
							id='fade-value'
							min={0}
							max={100}
							value={fadeValue}
							disabled={isPaused}
							onInput={e => setFadeValue(parseInt(e.currentTarget.value, 10))}
							className={`w-full ${isPaused ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
						/>
					</label>

					<label htmlFor='grayscale-value' className='flex flex-col gap-y-2'>
						<div className='w-fit rounded-md bg-stone-800 px-2 py-1 shadow-md'>
							<h1>Grayscale: {grayscaleValue}</h1>
						</div>
						<input
							type='range'
							name='grayscale-value'
							id='grayscale-value'
							min={0}
							max={100}
							value={grayscaleValue}
							disabled={isPaused}
							onInput={e => setGrayscaleValue(parseInt(e.currentTarget.value, 10))}
							className={`w-full ${isPaused ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
						/>
					</label>
				</div>
			</div>

			<div className='mt-auto flex flex-row items-center justify-center gap-x-4 pb-2'>
				<a
					className='rounded-md p-2 hover:bg-stone-700'
					href='https://github.com/iShibi/AdVeil'
					target='_blank'
					rel='noopener noreferrer'
					title='github.com/iShibi/AdVeil'
				>
					<GithubIcon />
				</a>
				<a
					className='rounded-md p-2 hover:bg-stone-700'
					href='https://x.com/iShiibi'
					target='_blank'
					rel='noopener noreferrer'
					title='x.com/iShiibi'
				>
					<TwitterIcon />
				</a>
			</div>
		</div>
	);
}
