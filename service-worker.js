chrome.runtime.onInstalled.addListener(async () => {
    
    const getContents = () => {
        return document.body.innerText;
    }
	
	const writeToClipboard = (value) => {
		navigator.clipboard.writeText(value)
	}
    
    const extractDataAndCopy = (tab) => {
		chrome.scripting.executeScript({
			target: { tabId: tab.id, allFrames: true },
			func: getContents
		 }, (results) => {
			
			const combined = results.map((result) => result.result).join("\\n")
			console.log(combined);
			const id = Math.random().toFixed(0)
			const value = JSON.stringify(["codebuddyPageData", tab.url, combined]);
			
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				func: writeToClipboard,
				args: [value]
			}, (results) => {});
			
		 });
    }
    
    const genericOnClick = (info, tab) => {
        if(info.menuItemId === "sendToCodebuddy") {
            extractDataAndCopy(tab);
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