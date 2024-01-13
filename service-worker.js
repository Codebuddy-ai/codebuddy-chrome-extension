chrome.runtime.onInstalled.addListener(async () => {
    
    const getContents = () => {
        return document.body.innerText;
    }
	
	const writeToClipboard = (value) => {
		navigator.clipboard.writeText(value)
	}
    
    const extractDataAndCopy = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log("Execute Script");
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id, allFrames: true },
                func: getContents
             }, (results) => {
                
                const combined = results.map((result) => result.result).join("\\n")
                console.log(combined);
                const id = Math.random().toFixed(0)
                const value = JSON.stringify(["codebuddyPageData", tabs[0].url, combined]);
				
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: writeToClipboard,
					args: [value]
                }, (results) => {});
                
             });
        });
    }
    
    const genericOnClick = (info) => {
        if(info.menuItemId === "sendToCodebuddy") {
            extractDataAndCopy();
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