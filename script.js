const usernameContainer = document.querySelector('.user-info .name')
const emailContainer = document.querySelector('.email')
const logoutBtn = document.querySelector('.logout-btn')
const menu = document.querySelector('.menu')
const container = document.querySelector('.container')
const myChatsContainer = container.querySelector('.my-chats')
const newChatContainer = container.querySelector('.new-chat')
const chatDetailsContainer = container.querySelector('.chat-details')
const settingsContainer = container.querySelector('.settings')
const changeUsernameBtn = settingsContainer.querySelector('.change-username')
const changeEmailBtn = settingsContainer.querySelector('.change-email')
const changePasswordBtn = settingsContainer.querySelector('.change-password')
const usernameInput = container.querySelector('.username')
const emailInput = container.querySelector('.email')
const passwordInput = container.querySelector('.password')
const repeatPasswordInput = container.querySelector('.repeat-password')
const okBtn = container.querySelector('.ok-btn')
const cancelBtn = container.querySelector('.cancel-btn')
const newChatInput = newChatContainer.querySelector('input')
const startChatBtn = newChatContainer.querySelector('button')
const settingsError = settingsContainer.querySelector('.settings-error')
const newChatError = newChatContainer.querySelector('.new-chat-error')





/**************************** Event handlers ****************************/
window.onload = async function () {
    const user = JSON.parse(localStorage.getItem('user'))
    usernameContainer.textContent = user.username
    emailContainer.textContent = user.email
    await loadChats()
}

logoutBtn.onclick = async function () {
    const response = await fetch('logout')
    const result = await response.json()
    if (result.success) {
        localStorage.removeItem("user")
        localStorage.removeItem("chats")
        location.href = '/login.html'
    } else {
        console.log(result.msg)
    }
}

menu.onclick = function (event) {
    if (event.target.classList.contains('active')) {
        return
    }
    menu.querySelector('.active').classList.remove('active')
    const className = event.target.className
    event.target.classList.add('active')
    container.querySelector('.active').classList.remove('active')
    container.querySelector('.' + className).classList.add('active')
}

changeUsernameBtn.onclick = function (event) {
    event.target.disabled = true
    changeEmailBtn.classList.add('hidden')
    changePasswordBtn.classList.add('hidden')
    usernameInput.classList.remove('hidden')
    okBtn.classList.remove('hidden')
    cancelBtn.classList.remove('hidden')
}
    
changeEmailBtn.onclick = function (event) {
    event.target.disabled = true
    changeUsernameBtn.classList.add('hidden')
    changePasswordBtn.classList.add('hidden')
    emailInput.classList.remove('hidden')
    okBtn.classList.remove('hidden')
    cancelBtn.classList.remove('hidden')
}
changePasswordBtn.onclick = function (event) {
    event.target.disabled = true
    changeUsernameBtn.classList.add('hidden')
    changeEmailBtn.classList.add('hidden')
    passwordInput.classList.remove('hidden')
    repeatPasswordInput.classList.remove('hidden')
    okBtn.classList.remove('hidden')
    cancelBtn.classList.remove('hidden')
}
function switchVisability() {
    settingsError.textContent = ''
    usernameInput.classList.add('hidden')
    emailInput.classList.add('hidden')
    passwordInput.classList.add('hidden')
    repeatPasswordInput.classList.add('hidden')
    okBtn.classList.add('hidden')
    cancelBtn.classList.add('hidden')
    changeUsernameBtn.classList.remove('hidden')
    changeEmailBtn.classList.remove('hidden')
    changePasswordBtn.classList.remove('hidden')
    changeUsernameBtn.disabled = false
    changeEmailBtn.disabled = false
    changePasswordBtn.disabled = false
}
okBtn.onclick = async function () {
    const mode = settingsContainer.querySelector('[disabled]').className

    if (mode === 'change-username') {
         if (usernameInput.value.trim() === '') {
            settingsError.textContent = 'Enter username'
            return
        }
        await fetch('change-username', {
            method: 'POST', 
            body: usernameInput.value
        })

        const user = JSON.parse(localStorage.getItem('user'))
        user.username = usernameInput.value
        localStorage.setItem('user', JSON.stringify(user))
        usernameContainer.textContent = user.username

    } else if (mode === 'change-email') {
        if (emailInput.value.trim() === '') {
            settingsError.textContent = 'Enter email'
            return
        }
        await fetch ('change-email', {
            method: 'POST', 
            body: emailInput.value
        })

        const user = JSON.parse(localStorage.getItem('user'))
        user.email = emailInput.value
        localStorage.setItem('user', JSON.stringify(user))
        emailContainer.textContent = user.email

    } else if (mode === 'change-password') {
        if (passwordInput.value.trim() === '') {
            settingsError.textContent = 'Enter password'
            return
        }
        if (passwordInput.value !== repeatPasswordInput.value) {
            settingsError.textContent = 'Passwords do not match'
            return
        }
        await fetch ('change-password', {
            method: 'POST',
            body: passwordInput.value
        })
    

    }
    switchVisability()
}

startChatBtn.onclick = async function () {
    const username = newChatInput.value.trim()

    if (username === '') {
        newChatError.textContent = 'Enter username'
        return
    }

    newChatError.textContent = ''

    const response = await fetch('start-chat', {
        method: 'POST',
        body: JSON.stringify({
            username: username
        })
    })

    const result = await response.json()

    if (result.success) {
        newChatInput.value = ''
        newChatError.textContent = ''
        await loadChats()
        openChat(result.chat)
    } else {
        newChatError.textContent = result.msg
    }

}


cancelBtn.onclick = function () {
    switchVisability()
}


/**************************** Helpers ****************************/



async function loadChats() {
    const response = await fetch('my-chats')
    const result = await response.json()

    if (result.success) {
        myChatsContainer.innerHTML = ''
        // console.log('Chats loaded:', result.data)

        for (const chat of result.data) {
            const chatElement = document.createElement('div')
            chatElement.className = 'chat-item'
            chatElement.dataset.id = chat.id
            chatElement.textContent = chat.otherUser

            // console.log('Rendered chat:', chat)

            chatElement.onclick = function () {
            openChat(chat)
            }

            myChatsContainer.append(chatElement)
        }
    } else {
        console.log(result.msg)
    }
}

function openChat(chat) {
    container.querySelector('.active').classList.remove('active')
    chatDetailsContainer.classList.add('active')
    chatDetailsContainer.innerHTML = ''

    const title = document.createElement('h2')
    title.textContent = chat.otherUser
    chatDetailsContainer.append(title)

    for (const message of chat.messages) {
        const messageElement = document.createElement('div')
        messageElement.className = 'message'
        messageElement.textContent = message.text
        chatDetailsContainer.append(messageElement)
    }

    const messageInput = document.createElement('input')
    messageInput.type = 'text'
    messageInput.placeholder = 'Type a message'

    const sendBtn = document.createElement('button')
    sendBtn.textContent = 'Send'

    sendBtn.onclick = async function () {
        const text = messageInput.value

        if (text.trim() === '') {
            return
        }



        const response = await fetch('send-message', {
            method: 'POST',
            body: JSON.stringify({
                chatId: chat.id,
                text: text
            })
        })

        const result = await response.json()

        if (result.success) {
            chat.messages.push(result.message)

            const messageElement = document.createElement('div')
            messageElement.className = 'message'
            messageElement.textContent = result.message.text

            chatDetailsContainer.insertBefore(messageElement, messageInput)
            messageInput.value = ''
        } else {
            console.log(result.msg)
        }
    }

    chatDetailsContainer.append(messageInput)
    chatDetailsContainer.append(sendBtn)
}
