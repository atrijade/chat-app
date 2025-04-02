const socket = io('http://localhost:8080');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const audio = document.getElementById('myAudio');
const enableAudioButton = document.getElementById('enableAudio');
let audioEnabled = false;

enableAudioButton.addEventListener('click', () => {
    audioEnabled = true;
    enableAudioButton.style.display = 'none';
});

var name = prompt("Enter your name");
const appendEle = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageElement.innerHTML = message;
    messageContainer.append(messageElement);
    if (position === 'left' && audioEnabled) {
        audio.play();
    }
};

if (name) {
    socket.emit('new-user-joined', name);
    console.log("Emitted from client");
} else {
    console.log("user cancelled the prompt or entered nothing");
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        appendEle(`<strong>You</strong>: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    });
} else {
    console.error("Form element 'send-container' not found.");
}

socket.on('user-joined', (name) => {
    appendEle(`<strong>${name}</strong> Joined the chat`, 'left');
});

socket.on('receive', (data) => {
    appendEle(`<strong>${data.name}</strong>: ${data.message} `, 'left');
});

socket.on('dis', (data) => {
    appendEle(`<strong>${data.name}</strong>: ${data.message} `, 'left');
});