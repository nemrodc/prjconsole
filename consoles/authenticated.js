import inquirer from "inquirer"
import chalk from "chalk"
import db from "../lowdb.js";
import { showBranchMenu } from "./branches.js";
import { formatGitStatus } from "../helpers/helpers.js";
import { printAvailableGitCommands } from "../helpers/helpers.js";
import { manageGitRemotes } from "./remotes.js";

export const authenticatedMenu = ( socket, CEXTID ) => {

    const { uid } = db.data;

    if (uid.length === 0) {
        console.log('Please authenticate first');
        mainMenu();
        return;
    }

    socket.on('listenPersistance', (data) => {
        // console.log(data)
        if( !data.EXTONLINE ) {
            return;
        } else {
            CEXTID = data.EXTSOCKETID;CEXTID
        }
    })

    socket.on('connect', () => {
        if(socket.flags.connectiontype === 'reconnect') {
            socket.emit('onCNPMreconnected', { NPMSOCKETID: socket.id, UID: uid })
            socket.flags.connectiontype = '';
        }
    })

    socket.on('NEWCEXTID', (newcextid) => {
        CEXTID = newcextid;
    })

    socket.off('branchList').on('branchList', (data) => {
        showBranchMenu(data, socket, CEXTID, uid);
    });

    socket.off('remotesList').on('remotesList', (data) => {
        manageGitRemotes(data, socket, CEXTID, uid);
    });

    socket.off('status').on('status', (data) => {
        console.log(formatGitStatus(data));
        authenticatedMenu(socket, CEXTID);
    })

    inquirer.prompt([
        {
            type: 'input', // Cambiado de 'input' a 'list'
            name: 'command',
            message: chalk.blue('PRJ'), // Mensaje modificado
        },
        {
            type: 'input',
            name: 'commitMessage',
            message: 'Commit message:',
            // Esta pregunta solo se muestra si el comando es 'commit'
            when: (answers) => answers.command.trim().startsWith('commit')
        },
        // {
        //     type: 'input',
        //     name: 'remoteUrl',
        //     message: 'Remote url:',
        //     // Esta pregunta solo se muestra si el comando es 'commit'
        //     when: (answers) => answers.command.trim().startsWith('remote')
        // },
        {
            type: 'input',
            name: 'repoUrl',
            message: 'Remote repository url:',
            // Esta pregunta solo se muestra si el comando es 'commit'
            when: (answers) => answers.command.trim().startsWith('clone')
        },
    ])
    .then(answers => {  
       const command = answers.command.replace('PRJ', '').trim(); 

       switch (command) {

            case 'getPAT':
                socket.emit('command', { user: CEXTID, command: 'getPAT', NPMUSER: { uid, SOCKETID: socket.id } });
                authenticatedMenu(socket, CEXTID);
                break;
            case 'getUSER':
                socket.emit('command', { user: CEXTID, command: 'getUSER', NPMUSER: { uid, SOCKETID: socket.id } });
                authenticatedMenu(socket, CEXTID);
                break;
            case 'getSusers':
                socket.emit('getOnlineUsers');
                authenticatedMenu(socket, CEXTID);
                break; 
                // 20b702c12b8df428b907ecf82f98a9ce777682e1

            case 'status':
                socket.emit('command', { user: CEXTID, command: 'status', NPMUSER: { uid, SOCKETID: socket.id } });
                break;
            case 'init':
                socket.emit('command', { user: CEXTID, command: 'init', NPMUSER: { uid, SOCKETID: socket.id } });
                authenticatedMenu(socket, CEXTID);
                break;
            case 'add':
                socket.emit('command', { user: CEXTID, command: 'add', NPMUSER: { uid, SOCKETID: socket.id } });
                authenticatedMenu(socket, CEXTID);
                break;
            case 'commit':
                const commitMessage = answers.commitMessage;
                socket.emit('command', { user: CEXTID, command: 'commit', NPMUSER: { uid, SOCKETID: socket.id }, commitMessage });
                authenticatedMenu(socket, CEXTID);
                break;
            case 'remote':
                // const remoteUrl = answers.remoteUrl;
                socket.emit('command', { user: CEXTID, command: 'remote', NPMUSER: { uid, SOCKETID: socket.id }, type: 'get' });
                // authenticatedMenu(socket, CEXTID);
                break;
            case 'push':
                socket.emit('command', { user: CEXTID, command: 'push', NPMUSER: { uid, SOCKETID: socket.id } });
                authenticatedMenu(socket, CEXTID);
                break;
            case 'pull':
                socket.emit('command', { user: CEXTID, command: 'pull', NPMUSER: { uid, SOCKETID: socket.id } });
                authenticatedMenu(socket, CEXTID);
                break;
            case 'clone':
                const repoUrl = answers.repoUrl;
                socket.emit('command', { user: CEXTID, command: 'clone', NPMUSER: { uid, SOCKETID: socket.id }, repoUrl });
                authenticatedMenu(socket, CEXTID);
                break; 
            case 'branch':
                socket.emit('command', { user: CEXTID, command: 'branch', NPMUSER: { uid, SOCKETID: socket.id } });
                break; 
            case 'help':           
                printAvailableGitCommands();
                authenticatedMenu(socket, CEXTID);
                break;  
            default:
                console.log('Unrecognized option');
                authenticatedMenu(socket, CEXTID);
                break;
                
                // 4554dda18e345d59ed18db4bb1f5e5562093103a
                // 4554dda18e345d59ed18db4bb1f5e5562093103a
                // 4554dda18e345d59ed18db4bb1f5e5562093103a
                // 20b702c12b8df428b907ecf82f98a9ce777682e1
       }
    })
    .catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });

}
