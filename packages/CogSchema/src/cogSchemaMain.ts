#!/usr/bin/env node
/**
 * Copyright(c) Microsoft Corporation.All rights reserved.
 * Licensed under the MIT License.
 */
// tslint:disable:no-console
// tslint:disable:no-object-literal-type-assertion
import * as chalk from 'chalk';
import * as cs from './cogSchema';
import * as process from 'process';
import * as program from 'commander';
import * as semver from 'semver';

// tslint:disable-next-line:no-let-requires no-require-imports
const pkg: IPackage = require('../package.json');
const requiredVersion: string = pkg.engines.node;
interface IPackage {
    version: string;
    engines: { node: string };
}
if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(`Required node version ${requiredVersion} not satisfied with current version ${process.version}.`);
    process.exit(1);
}

program.Command.prototype.unknownOption = (flag: string): void => {
    console.error(chalk.default.redBright(`Unknown arguments: ${flag}`));
    program.outputHelp((str: string) => {
        console.error(chalk.default.redBright(str));
        return '';
    });
    process.exit(1);
};

function parseBool(val?: string): boolean {
    return val === "true";
}

program
    .version(pkg.version, '-v, --Version')
    .usage("[options] <fileRegex ...>")
    .option("-o, output <path>", "Output path and filename for unified schema and associated .lg files per locale.")
    .option("-f, flat [boolean]", "Use flat (true) or hierarchical (false) naming for templates.", parseBool, true)
    .description(`Take JSON Schema files and merge them into a single schema file where $ref are included and allOf are merged. Will also use $role to define union types and lg properties.  All associated .lg files will be merged into a single .lg file per locale.  See readme.md for more information.`)
    .parse(process.argv);

cs.mergeSchemas(program.args, program.output, program.flat);