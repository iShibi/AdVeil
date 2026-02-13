import type { LocalStorage } from './Content';

let latestAdName = '';
const muteDurationEndBuffer = 150;
const cricketTabUrl = '*://*.hotstar.com/in/sports/cricket/*';
const adNameRegex = /(?:_|^)(\d{2})(?:s)?(?=$|_)/;

chrome.runtime.onStartup.addListener(init);
chrome.runtime.onInstalled.addListener(init);

async function init() {
	console.log('[ServiceWorker] Loaded "AdVeil" browser extension ServiceWorker script.');
	const { isPaused } = await chrome.storage.local.get<LocalStorage>(['isPaused']);
	if (isPaused) {
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
	const cricketTab = (await chrome.tabs.query({ url: cricketTabUrl }))[0];
	if (!cricketTab?.id) return console.log('Unable to get the cricket tab.');
	chrome.tabs.reload(cricketTab.id);
}

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
				if (!cricketTab) return console.log('Unable to get the cricket tab.');
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
		if (!cricketTab) return console.log('Unable to get the cricket tab.');
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
