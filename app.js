const http = require('node:http');
const fs = require('node:fs')
const { createHash } = require('node:crypto')

const contentTypes = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    ico: 'image/x-icon'
}

const authenticatedRoutes = [
    '/index.html',
    '/script.js',
    '/logout',
    '/my-chats',
    '/change-username',
    '/change-email',
    '/change-password',
    '/send-message',
    '/start-chat'
]


const server = http.createServer(function (req, res) {
    if (req.url === '/login.html') {
        sendFile(res, 'login.html')
    } else if (req.url === '/login') {
        let data = ''
        req.on('data', function (chunk) {
            data += chunk
        })
        req.on('end', function () {
            fs.readFile('users.json', function (err, users) {
                const userObj = JSON.parse(data)
                const usersArr = JSON.parse(users)
                for (const user of usersArr) {
                    if (user.email === userObj.email && user.password === userObj.password) {
                        proccessMyChats(user.id, usersArr, function (chats) {
                            user.cookie = createCookie(userObj)
                            fs.writeFile('users.json', JSON.stringify(usersArr, null, 4), function () {
                                res.writeHead(200, {
                                'Content-Type': 'application/json',
                                'Set-Cookie': `cookie=${user.cookie}; Path=/`
                            });
                                res.end(JSON.stringify({ 
                                    success: true, 
                                    user: {
                                        id: user.id,
                                        email: user.email,
                                        username: user.username
                                    }, 
                                    chats 
                                }));
                            })
                        })
                        return
                    }
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    msg: 'Authenticator error'
                }));
            })
        })
    } else if (req.url === '/signup.html') {
        sendFile(res, 'signup.html')
    } else if (req.url === '/signup') {
        let data = ''
        req.on('data', function (chunk) {
            data += chunk
        })
        req.on('end', function () {
            fs.readFile('users.json', function (err, users) {
                const userObj = JSON.parse(data)
                const usersArr = JSON.parse(users)
                for (const user of usersArr) {
                    if (user.email === userObj.email) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: false,
                            msg: 'Such user already exists'
                        }));
                        return
                    }
                }
                userObj.cookie = createCookie(userObj)
                usersArr.push({
                    id: usersArr.length + 1,
                    ...userObj,
                })
                fs.writeFile('users.json', JSON.stringify(usersArr, null, 4), function () {
                    res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Set-Cookie': `cookie=${userObj.cookie}; Path=/`
                });
                    res.end(JSON.stringify({
                        success: true
                    }));
                })
            })
        })
    } else if (req.url === '/favicon.ico') {
        sendFile(res, 'favicon.ico')
    } else if (req.url === '/common.css') {
        sendFile(res, 'common.css')
    } else if (authenticatedRoutes.includes(req.url)) {
        authenticateUser(req, res, function (currentUser, users) {
            if (req.url === '/index.html') {
                sendFile(res, 'index.html')
            } else if (req.url === '/script.js') {
                sendFile(res, 'script.js')
            } else if (req.url === '/logout') {
                const cookie = getCookie(req)
                if (currentUser.cookie === cookie) {
                    currentUser.cookie = null
                    fs.writeFile('users.json', JSON.stringify(users, null, 4), function () {
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Set-Cookie': 'cookie=; Path=/; Max-Age=0'
                        });
                        res.end(JSON.stringify({ success: true }));
                    })
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        msg: 'Authenticator error'
                    }));
                }
            } else if (req.url === '/my-chats') {
                proccessMyChats(currentUser.id, users, function (result) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        data: result
                    }));
                })

            } else if (req.url === '/send-message') {
                let data = ''

                req.on('data', function (chunk) {
                    data += chunk
                })

                req.on('end', function () {
                    const messageObj = JSON.parse(data)

                    fs.readFile('chats.json', function (err, contents) {
                        const chats = JSON.parse(contents)

                        for (const chat of chats) {
                            if (chat.id === messageObj.chatId && chat.members.includes(currentUser.id)) {
                                const newMessage = {
                                    id: chat.messages.length + 1,
                                    timestamp: +new Date(),
                                    user_id: currentUser.id,
                                    text: messageObj.text
                                }

                                chat.messages.push(newMessage)

                                fs.writeFile('chats.json', JSON.stringify(chats, null, 4), function () {
                                    res.writeHead(200, { 'Content-Type': 'application/json' })
                                    res.end(JSON.stringify({
                                        success: true,
                                        message: newMessage
                                    }))
                                })

                                return
                            }
                        }

                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({
                            success: false,
                            msg: 'Chat not found'
                        }))
                    })
                })

                } else if (req.url === '/start-chat') {
    let data = ''

    req.on('data', function (chunk) {
        data += chunk
    })

    req.on('end', function () {
        const chatObj = JSON.parse(data)
        const username = chatObj.username.trim()
        let targetUser

        for (const user of users) {
            if (user.username === username || user.login === username) {
                targetUser = user
                break
            }
        }

        if (!targetUser) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
                success: false,
                msg: 'User not found'
            }))
            return
        }

        if (targetUser.id === currentUser.id) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
                success: false,
                msg: 'You cannot start chat with yourself'
            }))
            return
        }

        fs.readFile('chats.json', function (err, contents) {
            const chats = JSON.parse(contents)

            for (const chat of chats) {
                if (chat.members.includes(currentUser.id) && chat.members.includes(targetUser.id)) {
                    res.writeHead(200, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({
                        success: true,
                        chat: prepareChat(chat, users, currentUser.id)
                    }))
                    return
                }
            }

            const newChat = {
                id: chats.length + 1,
                members: [currentUser.id, targetUser.id],
                messages: []
            }

            chats.push(newChat)

            fs.writeFile('chats.json', JSON.stringify(chats, null, 4), function () {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                    success: true,
                    chat: prepareChat(newChat, users, currentUser.id)
                }))
            })
        })
    })


            } else if (req.url === '/change-username') {
                let data = ''

                req.on('data', function (chunk) {
                    data += chunk
                })

                req.on('end', function () {
                    currentUser.username = data

                    fs.writeFile('users.json', JSON.stringify(users, null, 4), function () {
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({ success: true }))
                    })
                })
            } else if (req.url === '/change-email') {
                let data = ''

                req.on('data', function (chunk) {
                    data += chunk
                })

                req.on('end', function () {
                    currentUser.email = data

                    fs.writeFile('users.json', JSON.stringify(users, null, 4), function () {
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({ success: true }))
                    })
                })
            } else if (req.url === '/change-password') {
                let data = ''

                req.on('data', function (chunk) {
                    data += chunk
                })

                req.on('end', function () {
                    currentUser.password = data

                    fs.writeFile('users.json', JSON.stringify(users, null, 4), function () {
                        res.writeHead(200, { 'Content-Type': 'application/json' })
                        res.end(JSON.stringify({ success: true }))
                    })
                })
            }
        })
    } else {
        sendFile(res, '404.html')
    }
});

server.listen(8000);

function getCookie(req) {
    const cookieHeader = req.headers.cookie || ''
    return cookieHeader.replace('cookie=', '')
}


function authenticateUser(req, res, cb) {
    fs.readFile('users.json', function (err, users) {
        const cookie = getCookie(req)
        const usersArr = JSON.parse(users)

        for (const currentUser of usersArr) {
            if (currentUser.cookie === cookie) {
                cb(currentUser, usersArr)
                return
            }
        }

        res.writeHead(302, { Location: '/login.html' });
        res.end();
    })
}

function sendFile(res, fileName) {
    const ext = fileName.split('.')[1]
    const contentType = contentTypes[ext]
    fs.readFile(fileName, function (err, data) {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

function createCookie(user) {
    const hash = createHash('sha256');
    const timestamp = +new Date()
    const obj = { ...user, timestamp }
    const str = JSON.stringify(obj)
    hash.update(str)
    return hash.digest('hex').substring(0, 32)
}

function proccessMyChats(currentUserId, users, cb) {
    fs.readFile('chats.json', function (err, contents) {
        const chats = JSON.parse(contents)
        const result = []
        for (const chat of chats) {
            if (chat.members.includes(currentUserId)) {
                result.push(prepareChat(chat, users, currentUserId))
            }
        }
        cb(result)
    })
}

function prepareChat(chat, users, currentUserId) {
    let otherUserId
    for (const item of chat.members) {
        if (item !== currentUserId) {
            otherUserId = item
            break
        }
    }
    for (const user of users) {
        if (user.id === otherUserId) {
            chat.otherUser = user.username
            return chat
        }
    }
}
