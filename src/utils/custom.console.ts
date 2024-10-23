const { info, error, warn } = console;

console.info = (arg) => {
  info.call(console, `\x1b[32m${arg}\x1b[0m`);
};
console.error = (arg) => {
  error.call(console, `\x1b[31m${arg}\x1b[0m`);
};
console.warn = (arg) => {
  warn.call(console, `\x1b[36m${arg}\x1b[0m`);
};