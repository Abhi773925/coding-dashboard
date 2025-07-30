const { exec, spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CodeExecutionEngine {
  constructor() {
    this.executionQueue = new Map();
    this.executionHistory = new Map();
    this.tempDir = path.join(__dirname, '../temp');
    this.maxExecutionTime = 30000; // 30 seconds
    this.maxOutputSize = 1024 * 1024; // 1MB
    
    // Ensure temp directory exists
    fs.ensureDirSync(this.tempDir);
  }

  async executeCode(code, language, fileName = null, input = '', userId = null) {
    const executionId = uuidv4();
    const userTempDir = path.join(this.tempDir, userId || 'anonymous', executionId);
    
    try {
      // Create user-specific temp directory
      await fs.ensureDir(userTempDir);
      
      const execution = {
        id: executionId,
        language,
        code,
        input,
        startTime: new Date(),
        status: 'running',
        userId
      };
      
      this.executionQueue.set(executionId, execution);
      
      let result;
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          result = await this.executeJavaScript(code, userTempDir, fileName, input);
          break;
        case 'python':
        case 'py':
          result = await this.executePython(code, userTempDir, fileName, input);
          break;
        case 'java':
          result = await this.executeJava(code, userTempDir, fileName, input);
          break;
        case 'cpp':
        case 'c++':
          result = await this.executeCpp(code, userTempDir, fileName, input);
          break;
        case 'c':
          result = await this.executeC(code, userTempDir, fileName, input);
          break;
        case 'go':
          result = await this.executeGo(code, userTempDir, fileName, input);
          break;
        case 'rust':
          result = await this.executeRust(code, userTempDir, fileName, input);
          break;
        case 'php':
          result = await this.executePhp(code, userTempDir, fileName, input);
          break;
        case 'ruby':
          result = await this.executeRuby(code, userTempDir, fileName, input);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
      
      execution.status = 'completed';
      execution.endTime = new Date();
      execution.result = result;
      
      this.executionHistory.set(executionId, execution);
      this.executionQueue.delete(executionId);
      
      // Cleanup temp directory
      setTimeout(() => {
        fs.remove(userTempDir).catch(console.error);
      }, 5000);
      
      return result;
      
    } catch (error) {
      const execution = this.executionQueue.get(executionId);
      if (execution) {
        execution.status = 'error';
        execution.error = error.message;
        execution.endTime = new Date();
        this.executionHistory.set(executionId, execution);
        this.executionQueue.delete(executionId);
      }
      
      // Cleanup on error
      fs.remove(userTempDir).catch(console.error);
      
      return {
        stdout: '',
        stderr: error.message,
        exitCode: 1,
        executionTime: 0,
        memoryUsage: 0
      };
    }
  }

  async executeJavaScript(code, tempDir, fileName, input) {
    const file = path.join(tempDir, fileName || 'main.js');
    await fs.writeFile(file, code);
    
    return this.runCommand('node', [file], tempDir, input);
  }

  async executePython(code, tempDir, fileName, input) {
    const file = path.join(tempDir, fileName || 'main.py');
    await fs.writeFile(file, code);
    
    return this.runCommand('python', [file], tempDir, input);
  }

  async executeJava(code, tempDir, fileName, input) {
    const className = this.extractJavaClassName(code) || 'Main';
    const file = path.join(tempDir, `${className}.java`);
    await fs.writeFile(file, code);
    
    // Compile
    const compileResult = await this.runCommand('javac', [file], tempDir);
    if (compileResult.exitCode !== 0) {
      return compileResult;
    }
    
    // Run
    return this.runCommand('java', [className], tempDir, input);
  }

  async executeCpp(code, tempDir, fileName, input) {
    const sourceFile = path.join(tempDir, fileName || 'main.cpp');
    const execFile = path.join(tempDir, 'main');
    await fs.writeFile(sourceFile, code);
    
    // Compile
    const compileResult = await this.runCommand('g++', [sourceFile, '-o', execFile], tempDir);
    if (compileResult.exitCode !== 0) {
      return compileResult;
    }
    
    // Run
    return this.runCommand(execFile, [], tempDir, input);
  }

  async executeC(code, tempDir, fileName, input) {
    const sourceFile = path.join(tempDir, fileName || 'main.c');
    const execFile = path.join(tempDir, 'main');
    await fs.writeFile(sourceFile, code);
    
    // Compile
    const compileResult = await this.runCommand('gcc', [sourceFile, '-o', execFile], tempDir);
    if (compileResult.exitCode !== 0) {
      return compileResult;
    }
    
    // Run
    return this.runCommand(execFile, [], tempDir, input);
  }

  async executeGo(code, tempDir, fileName, input) {
    const file = path.join(tempDir, fileName || 'main.go');
    await fs.writeFile(file, code);
    
    return this.runCommand('go', ['run', file], tempDir, input);
  }

  async executeRust(code, tempDir, fileName, input) {
    const file = path.join(tempDir, fileName || 'main.rs');
    await fs.writeFile(file, code);
    
    // Compile
    const execFile = path.join(tempDir, 'main');
    const compileResult = await this.runCommand('rustc', [file, '-o', execFile], tempDir);
    if (compileResult.exitCode !== 0) {
      return compileResult;
    }
    
    // Run
    return this.runCommand(execFile, [], tempDir, input);
  }

  async executePhp(code, tempDir, fileName, input) {
    const file = path.join(tempDir, fileName || 'main.php');
    await fs.writeFile(file, code);
    
    return this.runCommand('php', [file], tempDir, input);
  }

  async executeRuby(code, tempDir, fileName, input) {
    const file = path.join(tempDir, fileName || 'main.rb');
    await fs.writeFile(file, code);
    
    return this.runCommand('ruby', [file], tempDir, input);
  }

  async runCommand(command, args, cwd, input = '') {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';
      
      const process = spawn(command, args, {
        cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: this.maxExecutionTime
      });

      // Handle timeout
      const timeout = setTimeout(() => {
        process.kill('SIGKILL');
        reject(new Error('Execution timeout'));
      }, this.maxExecutionTime);

      // Write input if provided
      if (input) {
        process.stdin.write(input);
        process.stdin.end();
      }

      // Collect stdout
      process.stdout.on('data', (data) => {
        stdout += data.toString();
        if (stdout.length > this.maxOutputSize) {
          process.kill('SIGKILL');
          reject(new Error('Output size limit exceeded'));
        }
      });

      // Collect stderr
      process.stderr.on('data', (data) => {
        stderr += data.toString();
        if (stderr.length > this.maxOutputSize) {
          process.kill('SIGKILL');
          reject(new Error('Error output size limit exceeded'));
        }
      });

      // Handle process completion
      process.on('close', (exitCode) => {
        clearTimeout(timeout);
        const executionTime = Date.now() - startTime;
        
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: exitCode || 0,
          executionTime,
          memoryUsage: process.spawnargs ? process.memoryUsage?.() : null
        });
      });

      // Handle process errors
      process.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  extractJavaClassName(code) {
    const match = code.match(/public\s+class\s+(\w+)/);
    return match ? match[1] : null;
  }

  // Package management methods
  async installPackage(language, packageName, tempDir) {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return this.runCommand('npm', ['install', packageName], tempDir);
      case 'python':
      case 'py':
        return this.runCommand('pip', ['install', packageName], tempDir);
      case 'go':
        return this.runCommand('go', ['get', packageName], tempDir);
      case 'rust':
        return this.runCommand('cargo', ['add', packageName], tempDir);
      default:
        throw new Error(`Package installation not supported for ${language}`);
    }
  }

  // Get execution statistics
  getExecutionStats() {
    const running = this.executionQueue.size;
    const completed = Array.from(this.executionHistory.values()).filter(e => e.status === 'completed').length;
    const failed = Array.from(this.executionHistory.values()).filter(e => e.status === 'error').length;
    
    const languageStats = {};
    this.executionHistory.forEach(execution => {
      const lang = execution.language;
      if (!languageStats[lang]) {
        languageStats[lang] = { total: 0, success: 0, failed: 0 };
      }
      languageStats[lang].total++;
      if (execution.status === 'completed') {
        languageStats[lang].success++;
      } else if (execution.status === 'error') {
        languageStats[lang].failed++;
      }
    });

    return {
      summary: { running, completed, failed },
      languageStats,
      totalExecutions: this.executionHistory.size
    };
  }

  // Get execution by ID
  getExecution(executionId) {
    return this.executionHistory.get(executionId) || this.executionQueue.get(executionId);
  }

  // Cancel execution
  cancelExecution(executionId) {
    const execution = this.executionQueue.get(executionId);
    if (execution && execution.process) {
      execution.process.kill('SIGTERM');
      execution.status = 'cancelled';
      this.executionHistory.set(executionId, execution);
      this.executionQueue.delete(executionId);
      return true;
    }
    return false;
  }

  // Cleanup old executions
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    for (const [id, execution] of this.executionHistory.entries()) {
      if (now - execution.startTime.getTime() > maxAge) {
        this.executionHistory.delete(id);
      }
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { name: 'JavaScript', extension: 'js', command: 'node' },
      { name: 'Python', extension: 'py', command: 'python' },
      { name: 'Java', extension: 'java', command: 'javac' },
      { name: 'C++', extension: 'cpp', command: 'g++' },
      { name: 'C', extension: 'c', command: 'gcc' },
      { name: 'Go', extension: 'go', command: 'go' },
      { name: 'Rust', extension: 'rs', command: 'rustc' },
      { name: 'PHP', extension: 'php', command: 'php' },
      { name: 'Ruby', extension: 'rb', command: 'ruby' }
    ];
  }
}

module.exports = CodeExecutionEngine;
