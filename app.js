const fs = require('fs-extra');
const { promisify } = require('util');
const path = require('path');
const chalk = require('chalk')
const program = require('commander');
const gitDownload = promisify(require("download-git-repo"));

program
  .option('-c, --cheese [type]', 'Add cheese with optional type')
  .parse(process.argv);

const [projectName, templateUrl] = program.args;

createProject();

async function createProject() {
  const projectPath = path.resolve(projectName);
  await mkdir(projectPath);
  process.chdir(projectPath);
  await downloadProject(templateUrl);
}

async function mkdir(dirname) {
  try {
    await fs.mkdir(dirname);
  } catch (err) {
    console.log(chalk.red(err.message));
    // TODO: add process.exit(1);
  }
}

async function downloadProject(projectUrl) {
  const tempDir = path.resolve('./_template');
  console.log(projectUrl);
  try {
    await gitDownload(projectUrl, tempDir);
    await fs.copy(tempDir, process.cwd());
    await fs.remove(tempDir);
  } catch (err) {
    console.log(chalk.red(err.message));
    // TODO: add process.exit(1);
  }
}
