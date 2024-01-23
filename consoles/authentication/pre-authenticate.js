import inquirer from 'inquirer';
import { connectSocket } from '../socket/connection.js';
// import { howToAuthenticate } from './howToAuthenticate.js';
import { mainMenu } from '../opt.js';
// import { authenticatedMenu } from '../authenticated.js';
import db from '../../lowdb.js';
import ora from 'ora';
const AUTH_TIMEOUT = 30000;
import { authenticate } from './authenticate.js';


export const verifySocketId = () => {

    const socket = connectSocket();
    // Primero, pedir al usuario que ingrese el ID de la extensión
    inquirer.prompt([
        {
            type: 'input',
            name: 'extensionId',
            message: 'Please enter your extension ID:',
        }
    ])
    .then(answers => {

        //verficar si el usuario ingreso un id de extension
        if (answers.extensionId.length === 0) {
            console.log('Please enter a valid extension ID');
            mainMenu()  
            return    
        }

        socket.emit('verifyID', answers.extensionId, (result) => {
            if (!result) {
                console.log('Extension ID is not valid, try again.');
                socket.close()
                mainMenu()          
            } else {
                authenticate(socket, answers.extensionId)
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
        mainMenu();
    });
};