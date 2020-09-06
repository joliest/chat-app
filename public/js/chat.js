const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages')

// templates
const messageTemplate = document.querySelector('#message-template')
                                .innerHTML

socket.on('message', message => {
    const html = Mustache.render(messageTemplate, {
        // can be accessed in {{ }}
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

const sendButton = document.querySelector('#send-button')

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // disable the button
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        // re-enable the button
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geo-location is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        socket.emit('sendLocation', {latitude, longitude}, isAcknowledged => {
            if (isAcknowledged) {
                console.log('Location shared')
            }
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})