import inquirer from 'inquirer';
import db from '../../lowdb.js';
import ora from 'ora';

import { howToAuthenticate } from './howToAuthenticate.js';
import { authenticatedMenu } from "../authenticated.js";
import { mainMenu } from '../opt.js';

const AUTH_TIMEOUT = 30000;


export const authenticate = async(socket, EXTID) => {
    const extensionId = EXTID

    return inquirer.prompt([
        {
            type: 'list',
            name: 'registerOption',
            message: 'Choose a register option:',
            choices: ['How to Authenticate?', 'Start with Oauth Google', 'Back to Main Menu'],
        }
    ])
    .then(answers => {
        switch (answers.registerOption) {
            case 'How to Authenticate?':
                howToAuthenticate(socket, extensionId);
                break;

            case 'Start with Oauth Google':
                const spinner = ora('Authenticating...').start();

                let timeoutId = setTimeout(() => {
                    spinner.fail('Authentication timed out');
                    socket.emit('authenticationResult', { to: extensionId, type: 'TOUT!', authStatus: { success: false, message: 'Authentication timed out' } } )
                    socket.close();   
                    mainMenu();
                }, AUTH_TIMEOUT);

            // Escuchar el resultado de la autenticación
                    socket.on('authenticationResult', (result) => {
                        clearTimeout(timeoutId); // Limpiar el timeout si se recibe una respuesta
                        if (result.status?.success || result.authStatus.success ) {
                            spinner.succeed('Authenticated!');
                            db.data.uid = result.uid
                            db.write()
                            setTimeout(() => {
                                socket.emit('EXTUSERINFO', { user: result.EXTUSERINFO, authStatus: result.authStatus })
                                authenticatedMenu( socket, result.CEXTID || result.EXTSOCKETID  )
                            }, 1000);               
                        } else {
                            // console.log(result)
                            spinner.fail('Authentication failed: ' + result.authStatus.message );      
                            setTimeout(() => {
                                socket.emit('EXTUSERINFO', { EXTSOCKETID: result.EXTSOCKETID, authStatus: result.authStatus})
                                socket.close();
                                mainMenu();
                            }, 1000); 

                        }  
                    });

                    // Emitir el comando de autenticación
                    socket.emit('command', { user: extensionId, command: 'authenticate' });
                break;

            case 'Back to Main Menu':
                socket.close();
                mainMenu();
                break;

            default:
                console.log('Opción no reconocida');
                socket.close();
                mainMenu();
                break;
        }
    });
}
