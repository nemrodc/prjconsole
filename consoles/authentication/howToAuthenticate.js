import inquirer from 'inquirer';
import { mainMenu } from '../opt.js';
import chalk from 'chalk';

import { authenticate } from './authenticate.js';

export const howToAuthenticate = (socket, EXTID) => {
    
    console.log(chalk.blue(
    `
        How to Authenticate?\n
        1. To authenticate, you must have a registered account on PrJManager.com.
        2. Install the 'PrJManager' extension available in Visual Studio Code.
        3. Chose the 'Start With Oauth Google' option in this interactive console.
        4. Once on the Oauth Google page, select the email with which you are registered at PrJManager.com.
        5. Upon successful authentication, a session token will be saved in your code editor,\n           allowing you to receive commands from the interactive console upon next login.\n
        
        This session token can be revoked directly from your account at PrJManager.com\n        in case you believe it has been compromised.       
    `))

    inquirer.prompt([
        {
            type: 'list',
            name: 'registerOption',
            message: 'Choose a register option:',
            choices: ['Back to Authentication'],
        }
    ])
    .then(answers => {
        switch (answers.registerOption) {
            case 'Back to Authentication':
                authenticate(socket, EXTID);
                break;
            default:
                console.log('Opción no reconocida');
                authenticate(socket, EXTID);
                break;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mainMenu();
    });
}


