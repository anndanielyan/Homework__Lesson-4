import os from 'os';
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

  return process.stderr.write('Invalid input!\n');
});
