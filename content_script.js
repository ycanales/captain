const toggleHiddenUsers = () => {
    document.getElementById('ASSIGNEE-show-more').click()
}

const getHiddenUsers = () => {
    toggleHiddenUsers()
    const list = document.querySelector('[data-role="droplistContent"]')
    const users =  list.querySelectorAll('[class^="Item__ContentWrapper"]')
    toggleHiddenUsers();
    return users;
}

const getVisibleUsers = () => {
   return document.querySelectorAll('[id$="quick-filters"] fieldset span[role="img"]');
}

const toggleUser = name => {
    const selector = `span[role="img"][aria-label="${name}"]`;
    document.querySelector(selector).click()
}

// Content script is attached to the tab
// due to the "content_scripts" declaration
// in the manifest.json file.
async function doit() {
    await setTimeout(null, 4000)
    console.log('CS doit')

    const visibleUsers = getVisibleUsers();
    const hiddenUsers = getHiddenUsers();
    const names = [
        ...[...visibleUsers].map(u => u.getAttribute('aria-label')), 
        ...[...hiddenUsers].map(u => u.innerText)
    ]
    
    console.log('CS names', names)
    
    browser.runtime.sendMessage({
        action: 'GET_USER_NAMES',
        from: 'contentScript',
        payload: names,
    })
    
}

function handleMessage(message) {
    console.log('CONTENT SCRIPT - message', message)
    const { action, payload } = message;
    let hidden = false;

    if (payload && action === 'TOGGLE_USER') {
        // Disable previous selected user

        if (payload.disable) {
            try {
                toggleUser(payload.disable)
            } catch (error) {
                toggleHiddenUsers();
                hidden = true;
                toggleUser(payload.disable)
            }
        }
        if (!payload.enable) {
            if (hidden) {
              setTimeout(toggleHiddenUsers, 1000)
            }
            return;
        }
        try {
            // If the user is visible...
            toggleUser(payload.enable);
        } catch (error) {
            // ...if not, search in hidden users.
            toggleHiddenUsers();
            toggleUser(payload.enable);
            setTimeout(toggleHiddenUsers, 1000)
        }
        
    }
}
browser.runtime.onMessage.addListener(handleMessage)

doit()