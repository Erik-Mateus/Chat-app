// login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__Form");
const loginInput = login.querySelector(".login__Input");

// chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__Form");
const chatInput = chat.querySelector(".chat__Input");
const chatMessages = chat.querySelector(".chat__Messages");


const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "" };

let websocket

const createSelfMessageElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("self__Message")
    div.innerHTML = content

    return div
}

const createOtherMessageElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("other__Message")

    span.classList.add("message__Sender")
    span.style.color = senderColor

    div.appendChild(span)



    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomValue = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior:"smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data);


    const message = userId == user.id 
        ? createSelfMessageElement(content) 
        : createOtherMessageElement(content, userName, userColor)


    // if (userId == user.id){
    //     const chatMessages = createSelfMessageElement(content)
    //     return chatMessages
    // }else{
    //     const chatMessages = createOtherMessageElement(content, userName, userColor)
    //     return chatMessages
    // }


    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault();


    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomValue();

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("wss://chat-app-back-end-0fyb.onrender.com");
    websocket.onmessage = processMessage

}

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    chatInput.value = "digite aqui sua mensagem"

    websocket.send(JSON.stringify(message))


}

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);