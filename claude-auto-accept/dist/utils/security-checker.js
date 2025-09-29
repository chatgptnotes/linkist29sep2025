"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityChecker = void 0;
const logger_1 = require("./logger");
class SecurityChecker {
    constructor(config) {
        this.config = config;
        this.logger = logger_1.Logger.getInstance();
        this.securityChecks = this.initializeSecurityChecks();
    }
    initializeSecurityChecks() {
        const checks = [];
        // Danger patterns - always deny
        this.config.dangerPatterns.forEach(pattern => {
            checks.push({
                name: 'danger_pattern',
                pattern: new RegExp(pattern, 'i'),
                riskLevel: 'high',
                action: 'deny'
            });
        });
        // Bypass patterns - always allow
        this.config.bypassPatterns.forEach(pattern => {
            checks.push({
                name: 'bypass_pattern',
                pattern: new RegExp(pattern, 'i'),
                riskLevel: 'low',
                action: 'allow'
            });
        });
        // Whitelist patterns - allow with medium risk
        this.config.whitelistPatterns.forEach(pattern => {
            checks.push({
                name: 'whitelist_pattern',
                pattern: new RegExp(pattern, 'i'),
                riskLevel: 'medium',
                action: 'allow'
            });
        });
        return checks;
    }
    assessRisk(request) {
        const message = request.message;
        const operation = request.operation;
        // Check if safety checks are disabled
        if (!this.config.safetyChecksEnabled) {
            return {
                decision: 'allow',
                riskLevel: 'low',
                reason: 'Safety checks disabled'
            };
        }
        // Run through security checks
        for (const check of this.securityChecks) {
            if (check.pattern.test(message) || check.pattern.test(operation)) {
                this.logger.debug(`Security check matched: ${check.name}`, {
                    pattern: check.pattern.source,
                    message,
                    operation
                });
                return {
                    decision: check.action,
                    riskLevel: check.riskLevel,
                    reason: `Matched ${check.name}: ${check.pattern.source}`,
                    matchedCheck: check
                };
            }
        }
        // Check operation type allowance
        if (!this.isOperationAllowed(operation)) {
            return {
                decision: 'deny',
                riskLevel: 'high',
                reason: `Operation type '${operation}' not allowed`
            };
        }
        // Default to asking for unknown patterns
        return {
            decision: 'ask',
            riskLevel: 'medium',
            reason: 'No specific security rule matched'
        };
    }
    isOperationAllowed(operation) {
        const allowedOps = this.config.allowedOperations;
        if (allowedOps.includes('all')) {
            return true;
        }
        // Map operation types to categories
        const operationCategories = {
            git_operations: ['git', 'commit', 'push', 'pull', 'clone', 'merge'],
            file_operations: ['read', 'write', 'create', 'delete', 'mkdir', 'touch'],
            network_operations: ['fetch', 'download', 'upload', 'curl', 'wget'],
            system_operations: ['install', 'update', 'restart', 'service']
        };
        for (const [category, keywords] of Object.entries(operationCategories)) {
            if (allowedOps.includes(category)) {
                if (keywords.some(keyword => operation.toLowerCase().includes(keyword))) {
                    return true;
                }
            }
        }
        return false;
    }
    updateConfig(newConfig) {
        this.config = newConfig;
        this.securityChecks = this.initializeSecurityChecks();
        this.logger.info('Security checker configuration updated');
    }
    validatePattern(pattern) {
        try {
            new RegExp(pattern);
            return { valid: true };
        }
        catch (error) {
            return {
                valid: false,
                error: error instanceof Error ? error.message : 'Invalid regex pattern'
            };
        }
    }
    testPattern(pattern, testString) {
        try {
            const regex = new RegExp(pattern, 'i');
            return regex.test(testString);
        }
        catch (error) {
            this.logger.error('Error testing pattern', error);
            return false;
        }
    }
}
exports.SecurityChecker = SecurityChecker;
//# sourceMappingURL=security-checker.js.map