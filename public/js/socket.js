const builder = message => {
    let p = document.createElement("h6");
    p.classList.add("lead", "console-text");
    p.textContent = message;
    p.style.fontSize = "1.2em";

    return p;
};

const disableLogin = (a, b, c) => {
    a.value = "";
    b.value = "";
    a.setAttribute("disabled", "disabled");
    b.setAttribute("disabled", "disabled");
    c.setAttribute("disabled", "disabled");
};

const stopApp = () => {
    socket.emit("eval", "stop");
};

const socket = io("http://localhost:2500", {path: "/console"});

socket.on("connect", () => {
    let message = builder("Connected");
    let log = document.querySelector("#console");
    let select = document.querySelector(".custom-select"),
    username = document.querySelector("#username"),
    password = document.querySelector("#password"),
    button = document.querySelector("#submit"),
    stop = document.querySelector("#stop");

    log.appendChild(message);

    socket.on("message", data => {
        message = builder(data);
        log.appendChild(message);

        if(data.indexOf("Started") != -1) {
            select.removeAttribute("disabled");
            disableLogin(username, password, button);
            return false;
        };

        if(data.indexOf("Target") != -1) {
            select.value = "select";
            select.setAttribute("disabled", "disabled");
            stop.style.display = "block";
            appendToOptionDiv("");
            return false;
        };
    });
});

socket.on("disconnect", () => {
    let message = builder("Disconnected");
    let log = document.querySelector("#console");
    log.appendChild(message);
});