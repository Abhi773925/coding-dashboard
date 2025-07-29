export const templates = {
    javascript: {
        name: 'JavaScript',
        extension: 'js',
        template: `// Welcome to PrepMate Code Editor
// This is a JavaScript starter template

function greet(name) {
    return \`Hello, \${name}!\`;
}

// Test the function
console.log(greet('Coder'));

// Write your code here...
`,
        defaultImports: `const readline = require('readline');
const fs = require('fs');`
    },
    python: {
        name: 'Python',
        extension: 'py',
        template: `# Welcome to PrepMate Code Editor
# This is a Python starter template

def greet(name):
    return f"Hello, {name}!"

# Test the function
print(greet("Coder"))

# Write your code here...
`,
        defaultImports: `import math
import random
import time`
    },
    cpp: {
        name: 'C++',
        extension: 'cpp',
        template: `// Welcome to PrepMate Code Editor
// This is a C++ starter template

#include <iostream>
using namespace std;

int main() {
    string name = "Coder";
    cout << "Hello, " << name << "!" << endl;
    
    // Write your code here...
    return 0;
}`,
        defaultImports: `#include <vector>
#include <string>
#include <algorithm>`
    },
    java: {
        name: 'Java',
        extension: 'java',
        template: `// Welcome to PrepMate Code Editor
// This is a Java starter template

public class Main {
    public static void main(String[] args) {
        String name = "Coder";
        System.out.println("Hello, " + name + "!");
        
        // Write your code here...
    }
}`,
        defaultImports: `import java.util.*;
import java.io.*;`
    }
};
