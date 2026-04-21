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
    console.log(mode)
    if (mode === 'change-username') {
        const response = await fetch('change-username', {
            method: 'POST', 
            body: ''
        })
        if (response.ok) {
            const result = await response.json()
            console.log(result)
        }
    } else if (mode === 'change email') {

    } else {

    }
    switchVisability()
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
    messageInput.placeholder = "Type a message"

    const SendBtn = document.createElement()
}
