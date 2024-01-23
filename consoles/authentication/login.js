import inquirer from "inquirer"
import { mainMenu } from "../opt.js";
import { startAuthenticationProcess } from "../../helpers/helpers.js";
import { connectSocket2 } from "../socket/connection.js";
import { authenticatedMenu } from "../authenticated.js";
import db from '../../lowdb.js';

export const login = async() => {
    try {
        const socket = await connectSocket2();

        // Aquí, la conexión de socket está establecida y puedes usar socket.id
        await startAuthenticationProcess(socket.id);
        socket.on('npmAuthResult', (response) => {
            const { success, message, user, PAT } = response;
            if( !success ) {
                console.log(message);
                socket.close();
                mainMenu();
            } else {
                console.log(message);
                socket.emit('onCNPMlogin', { success: true, message: 'Autenticación exitosa', NPMSOCKETID: user.SOCKETID, to: user.EXTSOCKETID, PAT })
                db.data.uid = user._id
                authenticatedMenu( socket, user.EXTSOCKETID );
            }
        });
        
    } catch (error) {       
        console.log('Error al conectar con el socket:', error);
        process.exit(1);
    }
}
