#!/usr/bin/env node

import { program } from 'commander';
import { spawn } from 'child_process';


program
  .version('1.0.0')
  .description('Gestor de proyectos');


// Personaliza el mensaje de ayuda
program.on('--help', () => {
    console.log('\nMi Herramienta CLI\n\n');
    console.log('Uso:');
    console.log('  $ mi-cli <comando> [opciones]\n');
    console.log('Comandos:');
    console.log('  init      Inicializa algo');
    console.log('  install   Instala algo');
    // ... más comandos y opciones
});

program
  .command('init')
  .description('Inicializa un nuevo proyecto')
  .action(() => {
    const subprocess = spawn('node', ['consoles/opt.js'], {
      stdio: 'inherit', // Esto asegura que la salida del subproceso sea visible en la consola
      shell: true      // Esto puede ser necesario dependiendo del entorno y del sistema operativo
    });

    subprocess.on('exit', (code, signal) => {
      console.log(`La consola interactiva terminó con el código ${code} y la señal ${signal}`);
    });
});

program.parse(process.argv);
