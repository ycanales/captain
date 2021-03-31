// https://stackoverflow.com/a/12646864/1004116
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let activeUser = '';

const getUsers = () => {
    browser.runtime.sendMessage({
        action: 'REQUEST_USERS',
        from: 'sidebar'
    }).then(users => {
        shuffleArray(users)
        console.log('SIDEBAR - shuffled users', users)
        
        const list = document.getElementById('list');
        list.textContent = '';
        users.forEach(n => {
            const button = document.createElement('button')
            button.innerText = n
            button.classList.add('button')
            button.classList.add('user')
            button.onclick = () => {onClickUser(button.innerText)};
            list.appendChild(button);
        })
    })
}

const onClickUser = name => {
    console.log(name)
    browser.runtime.sendMessage({
        action: 'TOGGLE_USER',
        from: 'sidebar',
        payload: {
            enable: name !== activeUser ? name : '',
            disable: activeUser
        }
    }).then(() => {
        activeUser = name !== activeUser ? name : '';
    })
}

document.getElementById('refresh').addEventListener('click', function() {
    getUsers();
})

getUsers()