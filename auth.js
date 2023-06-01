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

  if (input == 'add new_file_name') {
    return fsPromises
      .writeFile('new_file_name', '')
      .then(() => {
        console.log(`Empty file created successfully.`);
      })
      .catch((error) => {
        console.error('Error creating file:', error);
      });
  }

  if (input === 'rn path_to_file new_file_name') {
    return fsPromises
      .rename('new_file_name', 'path_to_file')
      .then(() => {
        console.log('File renamed successfully.');
      })
      .catch((error) => {
        console.error('Error renaming file:', error);
      });
  }

  if (input === 'cp path_to_file path_to_new_directory') {
    return fsPromises
      .copyFile('path_to_file', 'path_to_new_directory')
      .then(() => {
        console.log('File copied successfully.');
      })
      .catch((error) => {
        console.error('Error copying file:', error);
      });
  }

  if (input === 'mv path_to_file path_to_new_directory') {
    return fsPromises
      .rename('path_to_file', 'path_to_new_directory')
      .then(() => {
        console.log('File moved');
      })
      .catch((error) => {
        console.error('Error moving file:', error);
      });
  }

  if (input === 'rm path_to_file') {
    return fsPromises
      .unlink('path_to_new_directory', error)
      .then(() => {
        console.log('File has been removed');
      })
      .catch((error) => {
        console.error('Error removing file:');
      });
  }

  return process.stderr.write('Invalid input!\n');
});
