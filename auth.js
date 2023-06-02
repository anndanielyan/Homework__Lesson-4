import os from 'os';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { error } from 'console';
import Table from 'cli-table3';

const username = os.userInfo().username;
console.log(`Welcome ${username}!`);

function exitHandler() {
  process.stdout.write(`\nThank you ${username}, goodbye!\n`);
  return process.exit();
}

process.on('SIGINT', exitHandler);

process.stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input === '.exit') {
    exitHandler();
  }

  if (input === 'os --cpus') {
    return process.stdout.write(
      `${os
        .cpus()
        .map((cpu) => `${cpu.model} - ${cpu.speed / 1000}GHz`)
        .join('\n')}\n`
    );
  }

  if (input === 'os --homedir') {
    return process.stdout.write(`${os.homedir()}\n`);
  }

  if (input === 'os --username') {
    return process.stdout.write(`${username}\n`);
  }

  if (input === 'os --architecture') {
    return process.stdout.write(`${os.arch()}\n`);
  }

  if (input === 'os --hostname') {
    return process.stdout.write(`${os.hostname()}\n`);
  }

  if (input === 'os --platform') {
    return process.stdout.write(`${os.platform()}\n`);
  }

  if (input === 'os --memory') {
    return process.stdout.write(`${os.totalmem()} bytes\n`);
  }

  if (input === 'ls') {
    return fs.readdir('./', { withFileTypes: true }, (error, entries) => {
      if (error) {
        console.error('Error occured', error);
        return;
      }

      entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) {
          return -1;
        } else if (!a.isDirectory() && b.isDirectory()) {
          return 1;
        } else {
          return a.name.localeCompare(b.name);
        }
      });

      const table = new Table({
        head: ['(index)', 'Name', 'Type'],
        colWidths: [10, 25, 15],
      });

      entries.forEach((entry, index) => {
        const entryType = entry.isDirectory() ? 'Folder' : 'File';
        const entryName = entry.name.toString();
        table.push([index + 1, entryName, entryType]);
      });

      table.options.colAligns = table.options.head.map(() => 'center');

      console.log(table.toString());
    });
  }

  const arrInput = input.split(' ');

  if (arrInput[0] === 'add' && arrInput.length === 2) {
    return fsPromises
      .writeFile(arrInput.at(-1), '')
      .then(() => {
        console.log(`Empty file created successfully.`);
      })
      .catch((error) => {
        console.error('Error creating file:', error);
      });
  }

  if (arrInput[0] === 'rn' && arrInput.length === 3) {
    return fsPromises
      .rename(arrInput[1], arrInput.at(-1))
      .then(() => {
        console.log('File renamed successfully.');
      })
      .catch((error) => {
        console.error('Error renaming file:', error);
      });
  }

  if (arrInput[0] === 'cp' && arrInput.length === 3) {
    return fsPromises
      .copyFile(arrInput[1], arrInput.at(-1))
      .then(() => {
        console.log('File copied successfully.');
      })
      .catch((error) => {
        console.error('Error copying file:', error);
      });
  }

  if (arrInput[0] === 'mv' && arrInput.length === 3) {
    return fsPromises
      .rename(arrInput[1], arrInput.at(-1))
      .then(() => {
        console.log('File moved');
      })
      .catch((error) => {
        console.error('Error moving file:', error);
      });
  }

  if (arrInput[0] === 'rm' && arrInput.length === 2) {
    return fsPromises
      .unlink(arrInput.at(-1), error)
      .then(() => {
        console.log('File has been removed');
      })
      .catch((error) => {
        console.error('Error removing file:');
      });
  }

  return process.stderr.write('Invalid input!\n');
});
