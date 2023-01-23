# ChatGPT Chrome Extension 🤖 ✨

Based on the work of [https://github.com/gragland/chatgpt-chrome-extension](https://github.com/gragland/chatgpt-chrome-extension)

A Chrome extension that adds [ChatGPT](https://chat.openai.com) to every text box on the internet! Use it to write tweets, revise emails, fix coding bugs, or whatever else you need, all without leaving the site you're on.

![](https://i.imgur.com/IVTarA3.gif)

## Diff with the main repo

1. Removed the npm package to be fully in a Chrome extension.
2. Replace the text instead of inserting under.
3. Use of official OpenAi api with an apikey
4. Manage multi languages

## Install

Add the extension

1. Go to chrome://extensions in your Google Chrome browser
2. Check the Developer mode checkbox in the top right-hand corner
3. Click "Load Unpacked" to see a file-selection dialog
4. Select your local `chatgpt-chrome-extension/extension` directory
5. Go to the options of the extension to add your OpenAi apikey

You'll now see "Ask ChatGPT" if you right click in any text input or content editable area.