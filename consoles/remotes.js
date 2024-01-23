import inquirer from "inquirer";
import { authenticatedMenu } from "./authenticated.js";


async function addRemote( socket, CEXTID, uid ) {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name for the new remote URL:'
        },
        {
            type: 'input',
            name: 'url',
            message: 'Enter the remote repository URL:'
        }
    ]);

    socket.emit('command', { user: CEXTID, command: 'remote', NPMUSER: { uid, SOCKETID: socket.id }, remoteName: answers.name, remoteUrl: answers.url, type: 'add' });
}

async function removeRemote( data, socket, CEXTID, uid ) {
    const remoteNames = data.map(remote => remote.name);

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Select the remote you want to remove:',
            choices: remoteNames
        }
    ]);

    
    socket.emit('command', { user: CEXTID, command: 'remote', NPMUSER: { uid, SOCKETID: socket.id }, remoteName: answer.name, type: 'remove' });
}

export const manageGitRemotes = async( data, socket, CEXTID, uid ) => {

    console.log('Current remote URLs:');
    data.forEach((remote, index) => {
        console.log(`${index + 1}: ${remote.name} - Fetch: ${remote.refs.fetch}, Push: ${remote.refs.push}`);
    });

    const choices = [
        'Add Remote URL',
        'Remove Remote URL',
        'Exit'
    ];

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: choices
        }
    ]);

    switch (answer.action) {
        case 'Add Remote URL':
            await addRemote(socket, CEXTID, uid);
            break;
        case 'Remove Remote URL':
            await removeRemote(data, socket, CEXTID, uid);
            break;
        case 'Exit':
            authenticatedMenu(socket, CEXTID);
            break;
        default:
            console.log('Unrecognized option');
            break;
    }
}