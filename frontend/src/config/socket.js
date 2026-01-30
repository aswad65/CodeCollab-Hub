import socketIOClient from 'socket.io-client';

// import dotenv from 'dotenv'
// dotenv.config()

let socketInstance =null;
export const initializeSocket = (projectId) => {
   socketInstance=socketIOClient(
      "http://localhost:5000",
      {
         auth:{
               token:localStorage.getItem("token")
      },
      query:{
         projectId
      }
   }
   
   )
}
export function receiveMessage(callback) {

  socketInstance.on("project-message", (data) => {
    callback(data);
  });
}


export function sendMessage(eventName, data) {
  if (!socketInstance || typeof socketInstance.emit !== 'function') {
    console.warn('Socket not initialized yet — message not sent:', eventName, data);
    return;
  }
  
  socketInstance.emit(eventName, data);
}