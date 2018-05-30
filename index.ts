#!/usr/bin/env node
/**
 * @license
 * Copyright Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * clasp – The Apps Script CLI
 */

import 'connect';

import { login } from './src/auth';
import {
  clone,
  create,
  defaultCmd,
  deploy,
  deployments,
  help,
  list,
  logout,
  logs,
  openCmd,
  pull,
  push,
  redeploy,
  run,
  status,
  undeploy,
  version,
  versions,
} from './src/commands';
import { PROJECT_NAME } from './src/utils';

const commander = require('commander');

// CLI

/**
 * Set global CLI configurations
 */
commander
  .usage(`${PROJECT_NAME} <command> [options]`)
  .description(`${PROJECT_NAME} - The Apps Script CLI`);

/**
 * Logs the user in. Saves the client credentials to an rc file.
 */
commander
  .command('login')
  .description('Log in to script.google.com')
  .option('--no-localhost', 'Do not run a local server, manually enter code instead')
  .option('--ownkey', 'Save .clasprc.json file to current working directory')
  .action(login);

/**
 * Logs out the user by deleteing client credentials.
 */
commander
  .command('logout')
  .description('Log out')
  .action(logout);

/**
 * Creates a new script project.
 * @param {string} [scriptTitle] An optional project title.
 * @param {string} [scriptParentId] An optional project parent Id. The Drive ID of a parent file
 *   that the created script project is bound to. This is usually the ID of a
 *   Google Doc, Google Sheet, Google Form, or Google Slides file. If not set, a
 *   standalone script project is created.
 * @example `create "My Script" "1D_Gxyv*****************************NXO7o"`
 * @see https://developers.google.com/apps-script/api/reference/rest/v1/projects/create
 */
commander
  .command('create [scriptTitle] [scriptParentId]')
  .description('Create a script')
  .action(create);

/**
 * Fetches a project and saves the script id locally.
 */
commander
  .command('clone [scriptId] [versionNumber]')
  .description('Clone a project')
  .action(clone);

/**
 * Fetches a project from either a provided or saved script id.
 */
commander
  .command('pull')
  .description('Fetch a remote project')
  .action(pull);

/**
 * Force writes all local files to the script management server.
 * Ignores files:
 * - That start with a .
 * - That don't have an accepted file extension
 * - That are ignored (filename matches a glob pattern in the ignore file)
 */
commander
  .command('push')
  .description('Update the remote project')
  .action(push);

/**
 * Lists files that will be written to the server on `push`.
 * Ignores files:
 * - That start with a .
 * - That don't have an accepted file extension
 * - That are ignored (filename matches a glob pattern in the ignore file)
 */
commander
.command('status')
.description('Lists files that will be pushed by clasp')
.option('--json', 'Show status in JSON form')
.action(status);

/**
 * Opens the script editor in the user's browser.
 */
commander
  .command('open [scriptId]')
  .description('Open a script')
  .action(openCmd);

/**
 * List deployments of a script
 */
commander
  .command('deployments')
  .description('List deployment ids of a script')
  .action(deployments);

/**
 * Creates a version and deploys a script.
 * The response gives the version of the deployment.
 */
commander
  .command('deploy [version] [description]')
  .description('Deploy a project')
  .action(deploy);

/**
 * Undeploys a deployment of a script.
 * @example "undeploy 123"
 */
commander
  .command('undeploy <deploymentId>')
  .description('Undeploy a deployment of a project')
  .action(undeploy);

/**
 * Updates deployments of a script
 */
commander
  .command('redeploy <deploymentId> <version> <description>')
  .description(`Update a deployment`)
  .action(redeploy);

/**
 * List versions of a script
 */
commander
  .command('versions')
  .description('List versions of a script')
  .action(versions);

/**
 * Creates an immutable version of the script
 */
commander
  .command('version [description]')
  .description('Creates an immutable version of the script')
  .action(version);

/**
 * Lists your most recent 10 apps scripts
 * TODO: add --all flag
 * @example `list`
 * This would show someting like:
 * helloworld1          – xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * helloworld2          – xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 * helloworld3          – xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 */
commander
  .command('list')
  .description('List App Scripts projects')
  .action(list);

/**
 * Prints out 5 most recent the StackDriver logs.
 * Use --json for output in json format
 * Use --open to open logs in StackDriver
 */
commander
  .command('logs')
  .description('Shows the StackDriver logs')
  .option('--json', 'Show logs in JSON form')
  .option('--open', 'Open the StackDriver logs in browser')
  .action(logs);

/**
 * Clasp run <functionName>
 * This function runs your script in the cloud. You must supply
 * the functionName params. For now, it can
 * only run functions that do not require other authorization.
 * @param functionName function in the script that you want to run
 * @see https://developers.google.com/apps-script/api/reference/rest/v1/scripts/run
 * Note: to use this command, you must have used `clasp login --ownkey`
 */
commander
  .command('run <functionName>')
  .description('Run a function in your Apps Scripts project')
  .action(run);

/**
 * Displays the help function
 */
commander
  .command('help')
  .description('Display help')
  .action(help);

/**
 * All other commands are given a help message.
 */
commander
  .command('*', { isDefault: true })
  .description('Any other command is not supported')
  .action(defaultCmd);

// defaults to help if commands are not provided
if (!process.argv.slice(2).length) {
  commander.outputHelp();
}

// User input is provided from the process' arguments
commander.parse(process.argv);
