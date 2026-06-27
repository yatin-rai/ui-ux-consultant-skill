#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

const program = new Command();

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'ui-ux-consultant');

const PLATFORM_PATHS: Record<string, string> = {
  claude:   path.join('.claude', 'skills'),
  cursor:   path.join('.cursor', 'skills'),
  windsurf: path.join('.windsurf', 'skills'),
  copilot:  path.join('.github', 'skills'),
};

function getInstallTarget(ai: string, global: boolean, cwd: string): string {
  const home = process.env.USERPROFILE || process.env.HOME || '~';
  const base = global
    ? path.join(home, `.${ai}`, 'skills')
    : path.join(cwd, PLATFORM_PATHS[ai] || path.join(`.${ai}`, 'skills'));
  return path.join(base, 'ui-ux-consultant');
}

const pkg = require('../package.json');

program
  .name('uiux')
  .description('UI/UX Consultant Claude Skill installer')
  .version(pkg.version);

program
  .command('init')
  .description('Install the UI/UX Consultant skill into your AI assistant')
  .option('--ai <platform>', 'Target platform: claude | cursor | windsurf | copilot | all', 'claude')
  .option('--global', 'Install to home directory (available across all projects)', false)
  .action(async (opts) => {
    const cwd = process.cwd();
    const platforms = opts.ai === 'all'
      ? Object.keys(PLATFORM_PATHS)
      : [opts.ai];

    for (const platform of platforms) {
      if (!PLATFORM_PATHS[platform]) {
        console.error(chalk.red(`Unknown platform: ${platform}`));
        console.log(`Supported: ${Object.keys(PLATFORM_PATHS).join(', ')}, all`);
        process.exit(1);
      }

      const target = getInstallTarget(platform, opts.global, cwd);
      console.log(chalk.blue(`Installing to: ${target}`));

      try {
        await fs.ensureDir(path.dirname(target));
        await fs.copy(ASSETS_DIR, target, { overwrite: true });
        console.log(chalk.green(`✓ Installed for ${platform}`));
      } catch (err) {
        console.error(chalk.red(`✗ Failed for ${platform}:`), err);
      }
    }

    console.log(chalk.bold('\nDone! Start a new Claude session and ask for UI/UX help.'));
  });

program
  .command('update')
  .description('Re-sync skill files from the installed CLI version')
  .option('--ai <platform>', 'Target platform', 'claude')
  .option('--global', 'Update global install', false)
  .action(async (opts) => {
    const target = getInstallTarget(opts.ai, opts.global, process.cwd());
    console.log(chalk.blue(`Updating: ${target}`));
    try {
      await fs.copy(ASSETS_DIR, target, { overwrite: true });
      console.log(chalk.green(`✓ Updated for ${opts.ai}`));
    } catch (err) {
      console.error(chalk.red('✗ Update failed:'), err);
    }
  });

program
  .command('uninstall')
  .description('Remove the installed skill')
  .option('--ai <platform>', 'Target platform', 'claude')
  .option('--global', 'Remove from global install', false)
  .action(async (opts) => {
    const target = getInstallTarget(opts.ai, opts.global, process.cwd());
    if (await fs.pathExists(target)) {
      await fs.remove(target);
      console.log(chalk.green(`✓ Removed: ${target}`));
    } else {
      console.log(chalk.yellow(`Nothing to remove at: ${target}`));
    }
  });

program
  .command('versions')
  .description('Show installed CLI version')
  .action(() => {
    console.log(`ui-ux-consultant-cli: ${pkg.version}`);
  });

program.parse(process.argv);
