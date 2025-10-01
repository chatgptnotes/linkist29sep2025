"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoAcceptCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const auto_accept_agent_1 = require("../agents/auto-accept-agent");
const config_manager_1 = require("../config/config-manager");
const logger_1 = require("../utils/logger");
class AutoAcceptCommand {
    constructor() {
        this.agent = new auto_accept_agent_1.AutoAcceptAgent();
        this.configManager = config_manager_1.ConfigManager.getInstance();
        this.logger = logger_1.Logger.getInstance();
    }
    createCommand() {
        const program = new commander_1.Command();
        program
            .name('auto-accept')
            .description('Claude Code Auto-Accept System')
            .version('1.0.0');
        // Enable auto-accept
        program
            .command('on')
            .description('Enable auto-accept mode')
            .option('-f, --force', 'Force enable without confirmation')
            .action(async (options) => {
            await this.handleEnable(options.force);
        });
        // Disable auto-accept
        program
            .command('off')
            .description('Disable auto-accept mode')
            .action(async () => {
            await this.handleDisable();
        });
        // Show status
        program
            .command('status')
            .description('Show current auto-accept status')
            .action(async () => {
            await this.handleStatus();
        });
        // Configuration management
        program
            .command('config')
            .description('Manage configuration')
            .option('-s, --show', 'Show current configuration')
            .option('-e, --edit', 'Edit configuration interactively')
            .option('-r, --reset', 'Reset to default configuration')
            .action(async (options) => {
            await this.handleConfig(options);
        });
        // View logs
        program
            .command('logs')
            .description('View audit logs')
            .option('-n, --lines <number>', 'Number of log entries to show', '50')
            .option('-c, --clear', 'Clear audit logs')
            .action(async (options) => {
            await this.handleLogs(options);
        });
        // Test operation
        program
            .command('test')
            .description('Test if an operation would be auto-accepted')
            .argument('<operation>', 'Operation to test')
            .argument('<message>', 'Confirmation message to test')
            .action(async (operation, message) => {
            await this.handleTest(operation, message);
        });
        return program;
    }
    async handleEnable(force = false) {
        try {
            if (!force) {
                const answers = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'confirm',
                        message: 'Enable auto-accept mode? This will automatically accept certain operations.',
                        default: false
                    }
                ]);
                if (!answers.confirm) {
                    console.log(chalk_1.default.yellow('Auto-accept mode not enabled.'));
                    return;
                }
            }
            this.agent.enableAutoAccept();
            const status = this.agent.getSessionStatus();
            console.log(chalk_1.default.green('✓ Auto-accept mode enabled'));
            console.log(chalk_1.default.blue(`Session ID: ${status.sessionId}`));
            console.log(chalk_1.default.blue(`Max accepts: ${status.remainingAccepts}`));
            console.log(chalk_1.default.blue(`Session timeout: ${Math.floor(status.timeRemaining / 60)} minutes`));
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to enable auto-accept:'), error);
            this.logger.error('Failed to enable auto-accept', error);
        }
    }
    async handleDisable() {
        try {
            this.agent.disableAutoAccept();
            console.log(chalk_1.default.green('✓ Auto-accept mode disabled'));
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to disable auto-accept:'), error);
            this.logger.error('Failed to disable auto-accept', error);
        }
    }
    async handleStatus() {
        try {
            const status = this.agent.getSessionStatus();
            const config = this.configManager.getConfig();
            console.log(chalk_1.default.bold('\n📊 Auto-Accept Status'));
            console.log(chalk_1.default.gray('─'.repeat(50)));
            console.log(`${chalk_1.default.bold('Mode:')} ${status.active ? chalk_1.default.green('ENABLED') : chalk_1.default.red('DISABLED')}`);
            console.log(`${chalk_1.default.bold('Session ID:')} ${status.sessionId}`);
            console.log(`${chalk_1.default.bold('Accepts used:')} ${status.acceptCount}/${config.maxAutoAccepts}`);
            console.log(`${chalk_1.default.bold('Time remaining:')} ${Math.floor(status.timeRemaining / 60)}m ${status.timeRemaining % 60}s`);
            console.log(`\n${chalk_1.default.bold('Configuration:')}`);
            console.log(`${chalk_1.default.bold('Allowed operations:')} ${config.allowedOperations.join(', ')}`);
            console.log(`${chalk_1.default.bold('Safety checks:')} ${config.safetyChecksEnabled ? chalk_1.default.green('ENABLED') : chalk_1.default.red('DISABLED')}`);
            console.log(`${chalk_1.default.bold('Hook mode:')} ${config.hookMode}`);
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to get status:'), error);
            this.logger.error('Failed to get status', error);
        }
    }
    async handleConfig(options) {
        try {
            if (options.show) {
                await this.showConfig();
            }
            else if (options.edit) {
                await this.editConfig();
            }
            else if (options.reset) {
                await this.resetConfig();
            }
            else {
                console.log(chalk_1.default.yellow('Use --show, --edit, or --reset with the config command'));
            }
        }
        catch (error) {
            console.error(chalk_1.default.red('Configuration error:'), error);
            this.logger.error('Configuration error', error);
        }
    }
    async showConfig() {
        const config = this.configManager.getConfig();
        console.log(chalk_1.default.bold('\n⚙️  Configuration'));
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log(JSON.stringify(config, null, 2));
    }
    async editConfig() {
        const config = this.configManager.getConfig();
        const answers = await inquirer_1.default.prompt([
            {
                type: 'number',
                name: 'sessionTimeout',
                message: 'Session timeout (minutes):',
                default: config.sessionTimeout,
                validate: (value) => value > 0 || 'Must be greater than 0'
            },
            {
                type: 'number',
                name: 'maxAutoAccepts',
                message: 'Maximum auto-accepts per session:',
                default: config.maxAutoAccepts,
                validate: (value) => value > 0 || 'Must be greater than 0'
            },
            {
                type: 'checkbox',
                name: 'allowedOperations',
                message: 'Allowed operation types:',
                choices: [
                    { name: 'Git operations', value: 'git_operations', checked: config.allowedOperations.includes('git_operations') },
                    { name: 'File operations', value: 'file_operations', checked: config.allowedOperations.includes('file_operations') },
                    { name: 'Network operations', value: 'network_operations', checked: config.allowedOperations.includes('network_operations') },
                    { name: 'All operations', value: 'all', checked: config.allowedOperations.includes('all') }
                ]
            },
            {
                type: 'confirm',
                name: 'safetyChecksEnabled',
                message: 'Enable safety checks:',
                default: config.safetyChecksEnabled
            }
        ]);
        this.configManager.updateConfig(answers);
        this.agent.updateConfig(answers);
        console.log(chalk_1.default.green('✓ Configuration updated'));
    }
    async resetConfig() {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Reset configuration to defaults?',
                default: false
            }
        ]);
        if (answers.confirm) {
            this.configManager.reset();
            console.log(chalk_1.default.green('✓ Configuration reset to defaults'));
        }
    }
    async handleLogs(options) {
        try {
            if (options.clear) {
                await this.clearLogs();
                return;
            }
            const limit = parseInt(options.lines) || 50;
            const logs = await this.logger.getAuditLogs(limit);
            if (logs.length === 0) {
                console.log(chalk_1.default.yellow('No audit logs found'));
                return;
            }
            console.log(chalk_1.default.bold(`\n📝 Audit Logs (last ${logs.length} entries)`));
            console.log(chalk_1.default.gray('─'.repeat(80)));
            logs.forEach(log => {
                const timestamp = new Date(log.timestamp).toLocaleString();
                const decision = log.decision === 'accept' ? chalk_1.default.green('ACCEPT') : chalk_1.default.red('REJECT');
                const risk = this.formatRiskLevel(log.riskLevel);
                console.log(`${chalk_1.default.gray(timestamp)} ${decision} ${risk} ${chalk_1.default.cyan(log.operation)}`);
                console.log(`  ${chalk_1.default.gray('Message:')} ${log.message.substring(0, 60)}...`);
                console.log(`  ${chalk_1.default.gray('Reason:')} ${log.reason}`);
                console.log('');
            });
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to get logs:'), error);
            this.logger.error('Failed to get logs', error);
        }
    }
    async clearLogs() {
        const answers = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Clear all audit logs?',
                default: false
            }
        ]);
        if (answers.confirm) {
            this.logger.clearAuditLogs();
            console.log(chalk_1.default.green('✓ Audit logs cleared'));
        }
    }
    async handleTest(operation, message) {
        try {
            const result = await this.agent.testOperation(operation, message);
            console.log(chalk_1.default.bold('\n🧪 Test Result'));
            console.log(chalk_1.default.gray('─'.repeat(50)));
            console.log(`${chalk_1.default.bold('Operation:')} ${operation}`);
            console.log(`${chalk_1.default.bold('Message:')} ${message}`);
            console.log(`${chalk_1.default.bold('Would accept:')} ${result.wouldAccept ? chalk_1.default.green('YES') : chalk_1.default.red('NO')}`);
            console.log(`${chalk_1.default.bold('Risk level:')} ${this.formatRiskLevel(result.riskLevel)}`);
            console.log(`${chalk_1.default.bold('Reason:')} ${result.reason}`);
        }
        catch (error) {
            console.error(chalk_1.default.red('Test failed:'), error);
            this.logger.error('Test operation failed', error);
        }
    }
    formatRiskLevel(level) {
        switch (level) {
            case 'low': return chalk_1.default.green('LOW');
            case 'medium': return chalk_1.default.yellow('MEDIUM');
            case 'high': return chalk_1.default.red('HIGH');
            default: return chalk_1.default.gray('UNKNOWN');
        }
    }
}
exports.AutoAcceptCommand = AutoAcceptCommand;
//# sourceMappingURL=auto-accept-command.js.map