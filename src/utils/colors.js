import chalk from 'chalk';

/**
 * Colorize status values.
 * - done: green
 * - in-progress: yellow
 * - todo: red
 */
export function colorStatus(status) {
  const s = String(status).toLowerCase();
  if (s === 'done') return chalk.green(s);
  if (s === 'in-progress') return chalk.yellow(s);
  return chalk.red(s);
}

/**
 * Colorize priority values.
 * - high: bold red
 * - medium: bold yellow
 * - low: dim
 */
export function colorPriority(priority) {
  const p = String(priority).toLowerCase();
  if (p === 'high') return chalk.bold.red(p);
  if (p === 'medium') return chalk.bold.yellow(p);
  return chalk.dim(p);
}

export default { colorStatus, colorPriority };
