# Piston API Integration for Code Compilers

This document outlines the changes made to integrate the Piston API from emkc.org into both CodeCompiler components.

## Components Updated

### 1. CodeCompiler.jsx
- **Location**: `frontend/src/components/Compiler/CodeCompiler.jsx`
- **Purpose**: Main code compiler component

### 2. CollaborativeCodeCompilerPage.jsx
- **Location**: `frontend/src/components/Compiler/CollaborativeCodeCompilerPage.jsx`
- **Purpose**: Collaborative real-time code compiler with session management

## Changes Made

### 1. Language Configuration Update
- **Files**: Both CodeCompiler components
- **Change**: Replaced `judge0Languages` array with `pistonLanguages` array
- **Details**: Updated language definitions to use Piston API format:
  - Replaced `id` field with `language` and `version` fields
  - Maintained the same supported languages: JavaScript, TypeScript, Python, Java, C++, C, Kotlin, Rust, PHP, Go
  - Updated key references from `lang.id` to `lang.language`

### 2. API Endpoint Update
- **Old API**: Judge0 API via RapidAPI (required API key)
- **New API**: Piston API (https://emkc.org/api/v2/piston/execute)
- **Benefits**: 
  - No API key required
  - Free to use
  - Direct access without proxy
  - Better performance and reliability

### 3. Execution Function Overhaul
- **Function**: `runBackendCode()` (CodeCompiler) / `executeCode()` (CollaborativeCodeCompiler)
- **Changes**:
  - Updated request payload to match Piston API format
  - Added proper file structure with name and content
  - Updated response parsing for Piston API response format
  - Improved error handling and execution details

### 4. Collaboration Features Updated
- **Component**: CollaborativeCodeCompilerPage.jsx
- **Changes**:
  - Updated socket events to use new language format
  - Modified language change synchronization
  - Updated session restoration logic
  - Maintained backward compatibility for existing sessions

### 5. Runtime Fetching Feature
- **New Function**: `fetchAvailableRuntimes()`
- **Purpose**: Fetch all available language runtimes from Piston API
- **UI**: Added "Runtimes" button in CodeCompiler to fetch and log available runtimes

## API Endpoints Used

### GET /runtimes
- **URL**: `https://emkc.org/api/v2/piston/runtimes`
- **Purpose**: Get list of all available language runtimes
- **Response**: Array of runtime objects with language, version, and aliases

### POST /execute
- **URL**: `https://emkc.org/api/v2/piston/execute`
- **Purpose**: Execute code in specified language/runtime
- **Payload**:
  ```json
  {
    "language": "javascript",
    "version": "18.15.0",
    "files": [
      {
        "name": "main.js",
        "content": "console.log('Hello World');"
      }
    ],
    "stdin": "",
    "compile_timeout": 10000,
    "run_timeout": 3000,
    "compile_memory_limit": -1,
    "run_memory_limit": -1
  }
  ```

## Response Format
The Piston API returns execution results in the following format:
```json
{
  "compile": {
    "stdout": "",
    "stderr": "",
    "code": 0,
    "signal": null
  },
  "run": {
    "stdout": "Hello World\n",
    "stderr": "",
    "code": 0,
    "signal": null
  }
}
```

## Collaboration Features
### Socket Events Updated
- **language-change**: Now sends `language` and `languageInfo` instead of `languageId`
- **execute-code**: Updated to include new language structure
- **file-change**: Maintains compatibility while using new format

### Session Management
- **Backward Compatibility**: Existing sessions will gracefully handle the transition
- **Language Sync**: Real-time language changes synchronized across all participants
- **Session Restoration**: Updated to work with new language format

## Testing
A test file has been created at `frontend/src/testPistonAPI.js` with functions to:
1. Test runtime fetching
2. Test code execution

You can test the integration by:
1. Opening browser console
2. Running `window.testPistonAPI.testGetRuntimes()`
3. Running `window.testPistonAPI.testExecuteCode()`

## Migration Benefits
1. **No API Key Required**: Piston API is free and doesn't require authentication
2. **Better Performance**: Direct API calls without rate limits or proxy delays
3. **More Languages**: Piston supports a wider variety of languages and versions
4. **Active Maintenance**: Piston is actively maintained and updated
5. **Better Documentation**: Clear API documentation and examples
6. **Real-time Collaboration**: Enhanced collaboration features work seamlessly
7. **Improved Reliability**: Better uptime and stability

## Collaboration-Specific Benefits
1. **Session Continuity**: Existing collaborative sessions continue to work
2. **Real-time Sync**: Language changes and code execution are synchronized
3. **Multi-user Support**: Multiple users can collaborate without conflicts
4. **Enhanced UX**: Better user experience with faster execution times

## Future Enhancements
1. Dynamic language loading from Piston API
2. Support for multiple files in execution
3. Custom timeout and memory limit configuration
4. Language version selection within each language family
5. Enhanced collaboration features like voice/video chat
6. Code review and commenting system
7. Session recording and playback
8. Advanced permission management for collaborative sessions

## Backward Compatibility
- Existing saved code snippets will continue to work
- Old collaboration sessions will gracefully migrate to new format
- Language preferences are preserved across the transition
- No data loss during the migration process
