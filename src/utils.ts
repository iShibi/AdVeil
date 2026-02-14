export function setIcon(state: 'on' | 'off') {
	chrome.action.setIcon({
		path: {
			16: `/icon-${state}-16.png`,
			32: `/icon-${state}-32.png`,
			64: `/icon-${state}-64.png`,
			128: `/icon-${state}-128.png`,
			256: `/icon-${state}-256.png`,
		},
	});
}
