
const socket = io()
//var React = require('react');

//form elelments

const $messageForm = document.querySelector('#message-form')
const $messageformInput = $messageForm.querySelector('input')
const $messageformButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const $messagesTemplate = document.querySelector('#message-template').innerHTML
const $locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render($messagesTemplate, {
        username:message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on('Location-message', (message) => {
    console.log(message)
    const html = Mustache.render($locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render($sidebarTemplate,{
        room,
        users
    })
    
    document.querySelector('#sidebar').innerHTML = html
    })

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable submit form
    $messageformButton.setAttribute('disabled', 'disabled')


    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (msg) => {
        console.log('message is delivered', msg)
        $messageformButton.removeAttribute('disabled')
        $messageformInput.value = ''
        $messageformInput.focus()
    })

})
document.querySelector('#send-location').addEventListener('click', () => {

    if (!navigator.geolocation) {

        return alert('Geo location is not supported by your Browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {

        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude

        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })

})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})