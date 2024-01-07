const socket=io();

const chatForm=document.getElementById('chat-form')
const chatMessages=document.querySelector('.chat-messages')
socket.on('message',message=>{
  console.log(message)
  outputMessage(message)


  //scroll down
  chatMessages.scrollTop=chatMessages.scrollHeight
})



chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  const msg=e.target.elements.msg.value;
 socket.emit('chatMessage',msg );

 e.target.elements.msg.value=''
 e.target.elements.msg.focus=''
})



function outputMessage(message){
  const div=document.createElement('div')
  div.classList.add('message');
  div.innerHTML=` <p class="meta">Brad <span>9:12am</span></p>
  <p class="text">${message}</p>`
  document.querySelector('.chat-messages').append(div)
}