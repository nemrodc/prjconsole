import inquirer from 'inquirer';
import chalk from 'chalk';
import { authenticatedMenu } from './authenticated.js';

export const showBranchMenu = (branchSummary, socket, CEXTID, uid) => {

    console.log(`You are currently on the branch: ${chalk.green(branchSummary.current)}`);
    
    const choices = branchSummary.all.map(branch => ({
        name: branch,
        value: branch
    }));
    choices.push(
        new inquirer.Separator(), 
        { name: 'Create a new branch', value: 'new_branch' },
        new inquirer.Separator(),
        { name: 'Go back to main menu', value: 'go_back' } // Opción para volver al menú principal
    );

    inquirer.prompt([
        {
            type: 'list',
            name: 'selectedBranch',
            message: 'Choose a branch or create a new one:',
            choices,
            default: branchSummary.current
        }
    ])
    .then(answers => {
        if (answers.selectedBranch === 'new_branch') {
             inquirer.prompt([
                {
                    type: 'input',
                    name: 'newBranchName',
                    message: 'Enter the name for the new branch:'
                }
            ])
            .then(newBranchAnswer => {
                const newBranchName = newBranchAnswer.newBranchName;
                socket.emit('command', { user: CEXTID, command: 'createBranch', NPMUSER: { uid, SOCKETID: socket.id }, branchName: newBranchName });
            });
        } else if(answers.selectedBranch === 'go_back'){
            authenticatedMenu(socket, CEXTID)
        } else {
            const branchName = answers.selectedBranch;
            socket.emit('command', { user: CEXTID, command: 'checkoutBranch', NPMUSER: { uid, SOCKETID: socket.id }, branchName });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};
