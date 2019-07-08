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

const enableLogin = (a, b, c) => {
    a.removeAttribute("disabled");
    b.removeAttribute("disabled");
    c.removeAttribute("disabled");
};

const clearConsole = () => {
    let log = document.querySelector("#console");
    let text = document.querySelectorAll(".console-text");
    [...text].map(x => log.removeChild(x));
};

const stopApp = () => {
    let username = document.querySelector("#username"),
    password = document.querySelector("#password"),
    button = document.querySelector("#submit"),
    stop = document.querySelector("#stop");

    stop.style.display = "none";

    socket.emit("eval", "stop");
    clearConsole();
    enableLogin(username, password, button);
};

const socket = io("http://localhost:2500", {path: "/console"});

socket.on("connect", () => {
    let message = builder("InstaScript Ready to use! Please, Login.");
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
            message = builder("Loggin successful, select the one option above!");
            log.appendChild(message);
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