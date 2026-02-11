import { useEffect, useState } from 'react';
import iconOff64 from '../../public/icon-off-64.png';
import iconOn64 from '../../public/icon-on-64.png';

interface PopupProps {
	savedBlurValue: number | undefined;
	savedFadeValue: number | undefined;
	savedIsPausedValue: boolean | undefined;
}

export function Popup({ savedBlurValue, savedFadeValue, savedIsPausedValue }: PopupProps) {
	const [blurValue, setBlurValue] = useState(savedBlurValue ?? 0);
	const [fadeValue, setFadeValue] = useState(savedFadeValue ?? 0);
	const [isPaused, setIsPaused] = useState(savedIsPausedValue ?? false);

	useEffect(() => {
		chrome.storage.local.set({ blurValue });
		document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
	}, [blurValue]);

	useEffect(() => {
		chrome.storage.local.set({ fadeValue });
		document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
	}, [fadeValue]);

	useEffect(() => {
		chrome.storage.local.set({ isPaused });
		if (isPaused) {
			document.documentElement.style.setProperty('--blur-value', '0px');
			document.documentElement.style.setProperty('--opacity-value', '100%');
			chrome.action.setIcon({
				path: {
					16: '/icon-off-16.png',
					32: '/icon-off-32.png',
					64: '/icon-off-64.png',
					128: '/icon-off-128.png',
					256: '/icon-off-256.png',
				},
			});
		} else {
			document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
			document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
			chrome.action.setIcon({
				path: {
					16: '/icon-on-16.png',
					32: '/icon-on-32.png',
					64: '/icon-on-64.png',
					128: '/icon-on-128.png',
					256: '/icon-on-256.png',
				},
			});
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
							className={`h-28 w-28 rounded-full text-2xl opacity-(--opacity-value) shadow-lg blur-(--blur-value) hover:cursor-pointer ${isPaused ? 'bg-stone-400' : 'bg-green-400 text-stone-800'} transition duration-300 ease-out`}
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
							onChange={e => setBlurValue(parseInt(e.target.value))}
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
							onChange={e => setFadeValue(parseInt(e.target.value))}
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
					<svg className='h-5 w-5 fill-white' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
						<path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
					</svg>
				</a>
				<a
					className='rounded-md p-2 hover:bg-stone-700'
					href='https://x.com/iShiibi'
					target='_blank'
					rel='noopener noreferrer'
					title='x.com/iShiibi'
				>
					<svg className='h-5 w-5 fill-white' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
						<path d='M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z' />
					</svg>
				</a>
			</div>
		</div>
	);
}

function PauseIcon() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			stroke-width='1.5'
			stroke='currentColor'
			className='h-6 w-6 hover:stroke-red-400'
		>
			<path
				stroke-linecap='round'
				stroke-linejoin='round'
				d='M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
			/>
		</svg>
	);
}

function ResumeIcon() {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			stroke-width='1.5'
			stroke='currentColor'
			className='h-6 w-6 hover:stroke-green-400'
		>
			<path
				stroke-linecap='round'
				stroke-linejoin='round'
				d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z'
			/>
		</svg>
	);
}
