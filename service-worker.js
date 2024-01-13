chrome.runtime.onInstalled.addListener(async () => {
    
    const getContents = () => {
        return document.body.innerText;
    }

    const formatVersion = 1;

    async function addToClipboard(value) {
        await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: [chrome.offscreen.Reason.CLIPBOARD],
            justification: 'Write text to the clipboard.'
        });

        // Now that we have an offscreen document, we can dispatch the
        // message.
        chrome.runtime.sendMessage({
            type: 'copy-data-to-clipboard',
            target: 'offscreen-doc',
            data: value
        });
    }

    const showNotification = () => {
        chrome.notifications.create('codebuddy', {
            type: 'basic',
            silent: true,
            iconUrl: 'icon-48.png',
            title: 'Data extracted',
            message: 'Open your IDE to receive the data.'
        });
    }
    
    const extractDataAndCopy = (tab) => {
		chrome.scripting.executeScript({
			target: { tabId: tab.id, allFrames: true },
			func: getContents
		 }, (results) => {
			
			const combined = results.map((result) => result.result).join("\\n")
			console.log("Extracted data");
			const id = Math.random().toFixed(0)
            const value = JSON.stringify(["codebuddyPageData", id, formatVersion, tab.url, combined]);

            addToClipboard(value);
		 });
    }
    
    const genericOnClick = (info, tab) => {
        if(info.menuItemId === "sendToCodebuddy") {
            extractDataAndCopy(tab);
            showNotification()
        }
    };
    
    chrome.contextMenus.onClicked.addListener(genericOnClick);
    
    chrome.contextMenus.create({
        id: "sendToCodebuddy",
        title: "Send to Codebuddy",
        type: 'normal',
        contexts: ['page']
    });
    
    chrome.contextMenus
});