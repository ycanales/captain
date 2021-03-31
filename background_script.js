let usernames = []

async function handleAction(message, two, three) {
    console.log('BG handleAction', message)
    switch (message.from) {
        case 'sidebar':
            if (message.action === 'REQUEST_USERS') {
                return Promise.resolve(usernames);
            } else if (message.action === 'TOGGLE_USER') {
                browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT})
                .then(tabs => browser.tabs.get(tabs[0].id))
                .then(tab => {
                    console.info(tab);
                    browser.tabs.sendMessage(tab.id, message)
                });
            }
            break;
        case 'contentScript':
            if (message.action === 'GET_USER_NAMES') {
                usernames = message.payload;
            }
            break;
        default:
            break;
    }
}

browser.runtime.onMessage.addListener(handleAction);