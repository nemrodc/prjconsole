import chalk from 'chalk';
import inquirer from 'inquirer';
import { verifySocketId } from './authentication/pre-authenticate.js';
import { login } from './authentication/login.js';

console.log('Welcome to the PRJ CLI!');

export const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list', // Cambiado de 'input' a 'list'
            name: 'command',
            message: chalk.blue('Choose an option:'), // Mensaje modificado
            choices: ['Authenticate', 'Login'], // Opciones disponibles para elegir
        }
    ])
    .then( answers => {
        const command = answers.command;

       switch (command) {
        case 'Authenticate':
            verifySocketId();    
            break;
        case 'Login':
              login();
            break;
       
        default:
            break;
       }

    })
    .catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
}

mainMenu();