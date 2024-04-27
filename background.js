// 插件安装后
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.runtime.onMessage.addListener(function (message) {
  console.log(123);
});

// 用户点击后
let scriptExecuted = false;

chrome.action.onClicked.addListener(async (tab) => {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const nextState = prevState === "ON" ? "OFF" : "ON";
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === "ON" && !scriptExecuted) {
    await chrome.scripting.executeScript({
      target: {
        tabId: tab.id,
      },
      files: ["content-script.js"],
    });
    scriptExecuted = true;
  }

  await chrome.tabs.sendMessage(tab.id, {
    extension: nextState,
    tabId: tab.id,
  });
});
