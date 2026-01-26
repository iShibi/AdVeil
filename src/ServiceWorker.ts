console.log('[BACKGROUND] Loaded "mute-cricket-ads" browser extension ServiceWorker.');

let latestAdName = '';
const muteDurationEndBuffer = 100;
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
				console.log(adName);
				const duration = adName.match(adNameRegex)?.[1];
				if (!duration) return console.log('Unable to parse ad duration.');
				const cricketTab = (await chrome.tabs.query({ url: cricketTabUrl }))[0];
				await chrome.tabs.update(cricketTab.id, { muted: true });
				latestAdName = adName;
				setTimeout(
					() => {
						// Skip unmuting if another ad has started.
						if (adName === latestAdName) {
							chrome.tabs.update(cricketTab.id, { muted: false });
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
