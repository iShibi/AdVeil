import type { LocalStorage } from './Content';

console.log('[ServiceWorker] Loaded "AdVeil" browser extension ServiceWorker script.');

let latestAdName = '';
const muteDurationEndBuffer = 150;
const cricketTabUrl = '*://*.hotstar.com/in/sports/cricket/*';
const adNameRegex = /(?:_|^)(\d{2})(?:s)?(?=$|_)/;

// Listen for outgoing requests
chrome.webRequest.onBeforeRequest.addListener(
	// @ts-expect-error TS warns not to use async function but it works during runtime
	async function (details) {
		if (details.method === 'GET' && details.url.includes('bifrost-api.hotstar.com')) {
			const searchParams = new URL(details.url).searchParams;
			const adName = searchParams.get('adName');
			if (adName) {
				latestAdName = adName;
				console.log(adName);
				const duration = adName.match(adNameRegex)?.[1];
				if (!duration) return console.log('Unable to parse ad duration.');
				const cricketTab = (await chrome.tabs.query({ url: cricketTabUrl }))[0];
				const { isPaused } = await chrome.storage.local.get<LocalStorage>(['isPaused']);
				if (!isPaused && !cricketTab.mutedInfo?.muted) {
					chrome.tabs.update(cricketTab.id, { muted: true });
				}
				chrome.storage.local.set<LocalStorage>({ isAdPlaying: true });
				setTimeout(
					() => {
						// Skip unmuting and unbluring if another ad has started.
						if (adName === latestAdName) {
							chrome.tabs.update(cricketTab.id, { muted: false });
							chrome.storage.local.set<LocalStorage>({ isAdPlaying: false });
						}
					},
					parseInt(duration) * 1000 + muteDurationEndBuffer,
				);
			}
		}
		return {}; // Allow the request to proceed as normal
	},
	{ urls: ['*://*.hotstar.com/*'] },
);

chrome.storage.local.onChanged.addListener(async changes => {
	if (Object.hasOwn(changes, 'isPaused')) {
		const isPaused = changes['isPaused'].newValue as LocalStorage['isPaused'];
		const cricketTab = (await chrome.tabs.query({ url: cricketTabUrl }))[0];
		if (isPaused) {
			chrome.tabs.update(cricketTab.id, { muted: false });
		} else {
			const { isAdPlaying } = await chrome.storage.local.get<LocalStorage>(['isAdPlaying']);
			if (isAdPlaying) {
				chrome.tabs.update(cricketTab.id, { muted: true });
			}
		}
	}
});
