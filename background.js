const AD_SKIP_TIME = 99999;

let isSkipping = false;
function checkAndSkip(parentWrapper, htmlVideoContainer) {
	if (isSkipping) return;
	if (String(parentWrapper.className).includes("ad-showing")) {
		isSkipping = true;
		const element = htmlVideoContainer.children[0]
		if (element.tagName === "VIDEO") {
			const videoPlayer = element;
			if (videoPlayer.currentTime != AD_SKIP_TIME) videoPlayer.currentTime = AD_SKIP_TIME;
			console.log("Ad Skipped!");
			const ytButtons = Array.from(document.getElementsByClassName("ytp-button"));
			const skipButtons = ytButtons.filter(button => button.className.includes('skip'));
			if (skipButtons.length > 0) {
				skipButtons[0].click();
			}
		}
		isSkipping = false
	}
	setTimeout(() => { checkAndSkip(parentWrapper, htmlVideoContainer) }, 500)
}

// let blocker = false;
function skipAds() {
	// if (blocker) return;
	// blocker = true;
	const htmlVideoContainers = Array.from(document.getElementsByClassName("html5-video-container"));
	if (htmlVideoContainers.length === 1) {
		const htmlVideoContainer = htmlVideoContainers[0];
		const parentWrapper = htmlVideoContainer.parentNode;
		if (parentWrapper) {
			checkAndSkip(parentWrapper, htmlVideoContainer)
		}
	}
	// blocker = false
	// setTimeout(() => { skipAds() }, 1000);
}

chrome.tabs?.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && String(tab.url).includes("https://www.youtube.com/watch")) {
		console.log("youtube video loaded");
		chrome.scripting.executeScript({
			target: { tabId: tabId },
			function: skipAds,
		});
	}
})