const socket=io();

const chatForm=document.getElementById('chat-form')

socket.on('message',message=>{
  console.log(message)
  outputMessage(message)
})



chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();

  const msg=e.target.elements.msg.value;
 socket.emit('chatMessage',msg )

})



function outputMessage(message){
  const div=document.createElement('div')
  div.classList.add('message');
  div.innerHTML=``
}