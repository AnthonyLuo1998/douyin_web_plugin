let socket = null;

function callback(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      const obj = {
        text: mutation.addedNodes[0].innerText,
        html: mutation.addedNodes[0].innerHTML,
      };
      socket.send(JSON.stringify(obj));
    }
  }
}

//
function createLink() {
  const target = document.getElementsByClassName("webcast-chatroom___items")[0]
    .childNodes[0];

  if (!target) {
    alert("请联系开发人员更新版本！");
    return;
  }

  socket = new WebSocket("ws://localhost:8898");

  let observer = null;

  socket.onopen = () => {
    observer = new MutationObserver(callback);
    observer.observe(target, { childList: true });
    alert("连接成功!");
  };

  socket.onclose = () => {
    socket = null;
    observer.disconnect();
  };

  socket.onerror = () => {
    socket.close();
    socket = null;
    alert("连接失败!");
  };
}

chrome.runtime.onMessage.addListener(async (message) => {
  let { extension } = message;
  if (extension === "ON") {
    // link = createLink();
    chrome.runtime.sendMessage({ data: "hello" });
  } else {
    // content.js

    socket.close();
  }
});
