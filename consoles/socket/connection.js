import { io } from "socket.io-client";
let reconectandoPorTransportClose;
import db from "../../lowdb.js";
const { uid } = db.data;
import { showBranchMenu } from "../branches.js";

export const connectSocket = () => {
  const socket = io('http://localhost:8081');

  socket.on('connect', () => {
  });

  socket.on('respuesta', (data) => {
    console.log('Respuesta del servidor:', data);
  });

  socket.on('disconnect', (reason) => {
  });

  return socket;
}

export const connectSocket2 = () => {
  return new Promise((resolve, reject) => {
    const socket = io('http://localhost:8081');

    socket.on('connect', () => {
      if (reconectandoPorTransportClose) {
        socket.flags = {
          connectiontype: 'reconnect',
        };
        reconectandoPorTransportClose = false; // Resetear la bandera
      }
      resolve(socket);
    });



    // socket.on('branchList', (data) => {
    //   console.log(data)
    //   showBranchMenu(data, socket, socket.id, uid);
    // });


    socket.on('disconnect', (reason) => {
      if (reason === 'transport close') {
        reconectandoPorTransportClose = true;
      }
      reject(new Error('Desconexión del socket'));
    });

    socket.on('connect_error', (error) => {
      console.log('Error de conexión:', error);
      reject(error);
    });
  });
};