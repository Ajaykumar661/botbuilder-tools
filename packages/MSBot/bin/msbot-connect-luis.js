"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
const botframework_config_1 = require("botframework-config");
const chalk = require("chalk");
const program = require("commander");
const getStdin = require("get-stdin");
const txtfile = require("read-text-file");
const utils_1 = require("./utils");
program.Command.prototype.unknownOption = function (flag) {
    console.error(chalk.default.redBright(`Unknown arguments: ${flag}`));
    showErrorHelp();
};
program
    .name('msbot connect luis')
    .description('Connect the bot to a LUIS application')
    .option('-n, --name <name>', 'name for the LUIS app')
    .option('-a, --appId <appid>', 'AppId for the LUIS App')
    .option('-v, --version <version>', 'version for the LUIS App, (example: v0.1)')
    .option('-r, --region <region>', 'region for the LUIS App, (default:westus)')
    .option('--authoringKey <authoringkey>', 'authoring key for using manipulating LUIS apps via the authoring API (See http://aka.ms/luiskeys for help)')
    .option('--subscriptionKey <subscriptionKey>', '(OPTIONAL) subscription key used for querying a LUIS model\n')
    .option('-b, --bot <path>', 'path to bot file.  If omitted, local folder will look for a .bot file')
    .option('--input <jsonfile>', 'path to arguments in JSON format { id:\'\',name:\'\', ... }')
    .option('--secret <secret>', 'bot file secret password for encrypting service secrets')
    .option('--stdin', 'arguments are passed in as JSON object via stdin')
    .action((cmd, actions) => {
});
let args = program.parse(process.argv);
if (process.argv.length < 3) {
    program.help();
}
else {
    if (!args.bot) {
        botframework_config_1.BotConfiguration.loadBotFromFolder(process.cwd(), args.secret)
            .then(processConnectLuisArgs)
            .catch((reason) => {
            console.error(chalk.default.redBright(reason.toString().split('\n')[0]));
            showErrorHelp();
        });
    }
    else {
        botframework_config_1.BotConfiguration.load(args.bot, args.secret)
            .then(processConnectLuisArgs)
            .catch((reason) => {
            console.error(chalk.default.redBright(reason.toString().split('\n')[0]));
            showErrorHelp();
        });
    }
}
async function processConnectLuisArgs(config) {
    args.name = args.hasOwnProperty('name') ? args.name : config.name;
    if (args.stdin) {
        Object.assign(args, JSON.parse(await getStdin()));
    }
    else if (args.input) {
        Object.assign(args, JSON.parse(await txtfile.read(args.input)));
    }
    if (!args.hasOwnProperty('name'))
        throw new Error('Bad or missing --name');
    if (!args.appId || !utils_1.uuidValidate(args.appId))
        throw new Error('bad or missing --appId');
    if (!args.version)
        throw new Error('bad or missing --version');
    if (!args.authoringKey || !utils_1.uuidValidate(args.authoringKey))
        throw new Error('bad or missing --authoringKey');
    if (!args.region || args.region.length == 0)
        args.region = "westus";
    //if (!args.subscriptionKey || !uuidValidate(args.subscriptionKey))
    //    throw new Error("bad or missing --subscriptionKey");
    // add the service
    let newService = new botframework_config_1.LuisService({
        name: args.name,
        appId: args.appId,
        version: args.version,
        authoringKey: args.authoringKey,
        subscriptionKey: args.subscriptionKey,
        region: args.region
    });
    let id = config.connectService(newService);
    await config.save(args.secret);
    process.stdout.write(JSON.stringify(config.findService(id), null, 2));
    return config;
}
function showErrorHelp() {
    program.outputHelp((str) => {
        console.error(str);
        return '';
    });
    process.exit(1);
}
//# sourceMappingURL=msbot-connect-luis.js.map