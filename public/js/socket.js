const builder = message => {
    let p = document.createElement("p");
    p.classList.add("lead", "console-text");
    p.textContent = message;
    p.style.fontSize = "1.2em";

    return p;
};

const socket = new WebSocket("ws://localhost:2500");

(() => {
    let log = document.querySelector("#console");

    socket.onopen = () => {
        let message = builder("Connected!");
        log.appendChild(message);
    };

    socket.onmessage = event => {
        let message = builder(event.data);
        log.appendChild(message);
    };

    socket.onclose = () => {
        let message = builder("Disconnected");
        log.appendChild(message);
    };

})();