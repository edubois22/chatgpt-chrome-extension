// Listen for messages from the background script
async function getApikey() {
  await chrome.storage.sync.get({
    apikey: null,
  }, function(items) {
    OPENAI_APIKEY = items.apikey;
  });
}

var OPENAI_APIKEY = null;
getApikey();

const PRE_MSG = {
  "ask-chatgpt": "",
  "ask-chatgpt-fix-grammars": "Correct this to detected language:",
  "ask-chatgpt-extend": "Make a complete sentence or paragraph in the language you detected from this short brief",
  "ask-chatgpt-translate-english": 'Translate the sentence from detected language to English. Do not remove the "\n" in the text.',
  "ask-chatgpt-translate-spanish": 'Translate the sentence from detected language to Spanish. Do not remove the "\n" in the text.',
  "ask-chatgpt-translate-french": 'Translate the sentence from detected language to French. Do not remove the "\n" in the text.',
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (!OPENAI_APIKEY) {
    alert('No apikey, go to settings');
  }

  if (message.type.startsWith('ask-chatgpt')) {
    let originalActiveElement;
    let text;

    // If there's an active text input
    if (
      document.activeElement &&
      (document.activeElement.isContentEditable ||
        document.activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
        document.activeElement.nodeName.toUpperCase() === "INPUT")
    ) {
      // Set as original for later
      originalActiveElement = document.activeElement;
      // Use selected text or all text in the input
      text =
        document.getSelection().toString().trim() ||
        document.activeElement.textContent.trim();
    } else {
      // If no active text input use any selected text on page
      text = document.getSelection().toString().trim();
    }

    if (!text) {
      alert(
        "No text found. Select this option after right clicking on a textarea that contains text or on a selected portion of text."
      );
      return;
    }

    showLoadingCursor();

    // Send the text to the API endpoint
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+OPENAI_APIKEY,
      },
      body: JSON.stringify({
        'model': 'gpt-3.5-turbo-instruct',
        'prompt': PRE_MSG[message.type] + '"' + text + '"',
        'temperature': 0.5,
        'max_tokens': 256,
        'top_p': 1,
        'frequency_penalty': 0.6,
        'presence_penalty': 0,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {

        if (data.error) {
          alert(data.error.message);
          return false;
        }

        const REPLY = data.choices[0].text.trim()
            .replaceAll('""', '')
            .replace(/(^"|"$)/g, '');

        // Use original text element and fallback to current active text element
        const activeElement =
          originalActiveElement ||
          (document.activeElement.isContentEditable && document.activeElement);

        if (activeElement) {
          if (
            activeElement.nodeName.toUpperCase() === "TEXTAREA" ||
            activeElement.nodeName.toUpperCase() === "INPUT"
          ) {
            // Insert after selection
            activeElement.value =
              activeElement.value.slice(0,
                  activeElement.selectionStart
              ) +
              `${REPLY}` +
              activeElement.value.slice(
                activeElement.selectionEnd,
                activeElement.length
              );
          } else {
            // Special handling for contenteditable

            let replyHtml = REPLY.replaceAll('\n', '<br>');

            var range;
            if (window.getSelection && window.getSelection().getRangeAt) {
              range = window.getSelection().getRangeAt(0);
              range.deleteContents();
              var div = document.createElement("div");
              div.innerHTML = replyHtml;
              var frag = document.createDocumentFragment(), child;
              while ( (child = div.firstChild) ) {
                frag.appendChild(child);
              }
              range.insertNode(frag);
            } else if (document.selection && document.selection.createRange) {
              range = document.selection.createRange();
              range.pasteHTML(replyHtml);
            }
          }
        } else {
          // Alert reply since no active text area
          alert(`ChatGPT says: ${REPLY}`);
        }

        restoreCursor();
      })
      .catch((error) => {
        restoreCursor();
        alert(
          "Error calling OpenAi api."
        );
        throw new Error(error);
      });
  }
});

const showLoadingCursor = () => {
  const style = document.createElement("style");
  style.id = "cursor_wait";
  style.innerHTML = `* {cursor: wait;}`;
  document.head.insertBefore(style, null);
};

const restoreCursor = () => {
  document.getElementById("cursor_wait").remove();
};
