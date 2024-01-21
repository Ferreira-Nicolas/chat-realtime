

// LOGIN
const login = document.querySelector('.login')
const loginForm = document.querySelector('.login-form')
const loginInput = document.querySelector('.login-input')

// CHAT
const chat = document.querySelector('.chat')
const chatForm = document.querySelector('.chat-form')
const chatInput = document.querySelector('.chat-input')
const chatBtn = document.querySelector('.chat-button')
const chatMessages = document.querySelector('.chat-messages')
const chatQuit = document.querySelector('.chat-quit')



const user = { id: "", name: "", color: "" }

let ws


const handleLogin = (e) => {
  e.preventDefault();

  user.id = Date.now();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = 'none';
  chat.style.display = 'flex';

  ws = new WebSocket('ws://192.168.1.12:8080');

  ws.onopen = () => {
    // Envia uma mensagem quando a conexão WebSocket é aberta
    ws.send({msg:`Usuario: ${user.name} entrou no chat!`});
  };

  ws.onmessage = processMessage;
};


const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data)

  if(userId == user.id){

    const selfMsg = createSelfMessage(content)
    chatMessages.appendChild(selfMsg)
  }else{

    const alsoMsg = createAlsoMessage(userName,content,userColor)
    chatMessages.appendChild(alsoMsg)
  }
  // const element = createAlsoMessage(userName, content)

}


const getRandomColor = () => {
  // Gera valores de componentes RGB 
  const r = Math.floor(Math.random() * 100) + 155; // Red
  const g = Math.floor(Math.random() * 100) + 155; // Green
  const b = Math.floor(Math.random() * 100) + 155; // Blue

  // Converte para string hexadecimal
  const corHex = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

  return corHex;
}


const sendMenssage = e => {
  e.preventDefault()

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value
  }

  ws.send(JSON.stringify(message))
  console.log(message)
 
  chatInput.value = ''

}


const createSelfMessage = (content) => {

  const divSelfMessge = document.createElement('div');

  divSelfMessge.classList.add('message--self');

  divSelfMessge.innerHTML = content
  scroll()
  return divSelfMessge;
}

const createAlsoMessage = (userName, content,userColor) => {
  // Criação do elemento <div> para mensagens de outros usuários
  const divOtherMessage = document.createElement('div');
  divOtherMessage.classList.add('message--other');

  // Criação do elemento <span> para o remetente
  const senderSpan = document.createElement('span');
  senderSpan.classList.add('message--sender');
  senderSpan.style.color = userColor
  senderSpan.textContent = userName;

  // Adicionando o <span> ao <div>
  divOtherMessage.appendChild(senderSpan);

  // Adicionando o conteúdo da mensagem ao <div>
  divOtherMessage.appendChild(document.createTextNode(content));
  scroll()
  // Adicionando o <div> ao body (ou a outro elemento desejado)
  return divOtherMessage;
  
}
const scroll = () =>{
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth'
  });
}

const quitChat = () =>{
  location.reload()
}





loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMenssage)
chatQuit.addEventListener('click',quitChat)
