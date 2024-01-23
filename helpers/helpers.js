import { spawn } from 'child_process';
import axios from 'axios';
import crypto from 'crypto';
import open from 'open';
import chalk from 'chalk';

export const registerConsole = () => {
    const child = spawn('node', ['consoles/register.js'], {

    stdio: 'inherit', // Para mantener el flujo de entrada/salida en la nueva consola
    detached: true, // Para que el proceso hijo pueda continuar ejecutándose independientemente
    shell: true // Abre el script en una nueva ventana de consola
    
    });

    child.on('error', (err) => {
        console.error(`Failed to start subprocess: ${err}`);
    });
}

export const startAuthenticationProcess = async(socketID) => {
    // console.log(socketID)
    const response = await axios.post('http://localhost:3000/api/auth/extension-oauth', { socketID, type: 'NPMAUTH' });
    const url = response.data.url;

    if( !url ) {
        console.log('Error al obtener la URL de autenticación');
        return;
    } 

    open(url);
}

export const generateAuthCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Genera un código de 6 caracteres hexadecimales
}

export const formatGitStatus = (status) => {
    let output = '';

    // Current Branch
    output += `Current branch: ${chalk.green(status.current)}\n`;

    // Tracking state with respect to remote
    if (status.tracking) {
        output += `Tracking: ${chalk.yellow(status.tracking)}\n`;
        output += `You are ${chalk.yellow(status.ahead)} commits ahead and ${chalk.yellow(status.behind)} commits behind the remote.\n`;
    } else {
        output += 'No remote branch tracking.\n';
    }

    // Changes in the repository
    let changesExist = false;
    if (status.created.length > 0) {
        output += `Created files: ${chalk.blue(status.created.join(', '))}\n`;
        changesExist = true;
    }
    if (status.staged.length > 0) {
        output += `Files staged for commit: ${chalk.blue(status.staged.join(', '))}\n`;
        changesExist = true;
    }
    if (status.modified.length > 0) {
        output += `Modified files: ${chalk.blue(status.modified.join(', '))}\n`;
        changesExist = true;
    }
    if (status.deleted.length > 0) {
        output += `Deleted files: ${chalk.blue(status.deleted.join(', '))}\n`;
        changesExist = true;
    }
    if (status.renamed.length > 0) {
        output += `Renamed files: ${chalk.blue(status.renamed.map(file => `${file.from} -> ${file.to}`).join(', '))}\n`;
        changesExist = true;
    }
    if (!changesExist) {
        output += 'No changes in the repository.\n';
    }

    // Conflicts
    if (status.conflicted.length > 0) {
        output += 'There are conflicts in the following files:\n';
        output += `${chalk.red(status.conflicted.join(', '))}\n`;
    }

    return output;
}

export const printAvailableGitCommands = () => {
    console.log("Available Git Commands and Their Descriptions:");
    console.log(`1. ${chalk.green('status')} - Checks the current state of the Git repository. Shows staged, unstaged, and untracked files.`);
    console.log(`2. ${chalk.green('init')} - Initializes a new Git repository. This creates a new subdirectory named .git.`);
    console.log(`3. ${chalk.green('add')} - Adds files to the staging area for Git.`);
    console.log(`4. ${chalk.green('commit')} - Saves your changes to the local repository. Requires a commit message as an argument.`);
    console.log(`5. ${chalk.green('remote')} - Manage set of tracked repositories. Typically used to add a new remote repository.`);
    console.log(`6. ${chalk.green('push')} - Uploads local repository content to a remote repository.`);
    console.log(`7. ${chalk.green('pull')} - Fetches and integrates changes from a remote repository into the current branch.`);
    console.log(`8. ${chalk.green('clone')} - Copies a Git repository so you can add to it or branch into a new project.`);
    console.log(`9. ${chalk.green('branch')} - Lists existing branches, creates new ones, or change branch.`);
}



// glpat-izh8dNAoHELfDnLzFCxC