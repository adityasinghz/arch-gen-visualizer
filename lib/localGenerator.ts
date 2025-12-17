// Advanced local diagram generator for complex algorithms
// Specifically designed to handle recursive patterns with memoization

function sanitize(text: string): string {
    return text
        .replace(/\|\|/g, ' OR ')
        .replace(/&&/g, ' AND ')
        .replace(/!=/g, ' not equal ')
        .replace(/==/g, ' equals ')
        .replace(/<=/g, ' less or equal ')
        .replace(/>=/g, ' greater or equal ')
        .replace(/</g, ' less ')
        .replace(/>/g, ' greater ')
        .replace(/["{}()\[\]]/g, '')
        .replace(/:/g, '')
        .replace(/\|/g, '')
        .replace(/&/g, '')
        .trim()
        .substring(0, 40) || 'Step';
}

export function generateFlowchartLocally(code: string): { diagram: string; complexity: number } {
    const lines = code.split('\n');
    let diagram = 'graph TD\n';
    let nodeId = 0;
    let complexity = 1;

    // Analyze code structure
    const hasMemoization = code.includes('dp[') || code.includes('memo[') || code.includes('cache[');
    const hasMax = code.includes('max(');
    const hasMin = code.includes('min(');

    // Track function names for recursive detection
    const functions: string[] = [];
    for (const line of lines) {
        const funcMatch = line.match(/(?:int|void|bool|def|function)\s+(\w+)\s*\(/);
        if (funcMatch) functions.push(funcMatch[1]);
    }

    diagram += '    Start([Start])\n';
    let currentNode = 'Start';
    let decisionStack: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Skip empty lines, comments, preprocessor
        if (!line || line.startsWith('//') || line.startsWith('#') || line.startsWith('using')) continue;

        // Function definitions
        const funcMatch = line.match(/(?:int|void|bool|def|function)\s+(\w+)\s*\(/);
        if (funcMatch) {
            nodeId++;
            const funcName = sanitize(funcMatch[1]);
            diagram += `    N${nodeId}[[${funcName}]]\n`;
            diagram += `    ${currentNode} --> N${nodeId}\n`;
            currentNode = `N${nodeId}`;
            continue;
        }

        // Base case (n==0 || W==0 pattern)
        if (line.match(/if\s*\([^)]*==\s*0[^)]*\)/)) {
            nodeId++;
            complexity++;
            const cond = sanitize(line.replace(/^if\s*\(?/, '').replace(/\).*$/, ''));
            diagram += `    N${nodeId}{Base Case?<br/>${cond}}\n`;
            diagram += `    ${currentNode} --> N${nodeId}\n`;
            decisionStack.push(`N${nodeId}`);

            // Return for base case
            nodeId++;
            diagram += `    N${nodeId}[Return 0]\n`;
            diagram += `    N${nodeId - 1} -->|Yes| N${nodeId}\n`;
            diagram += `    N${nodeId} --> End\n`;

            currentNode = decisionStack[decisionStack.length - 1];
            continue;
        }

        // Memoization check (dp[n][W]!=-1 pattern)
        if (hasMemoization && line.match(/if\s*\([^)]*\[.*\]\s*!=\s*-1/)) {
            nodeId++;
            complexity++;
            diagram += `    N${nodeId}{Cached?<br/>Check memoization}\n`;
            diagram += `    ${currentNode} --> N${nodeId}\n`;
            decisionStack.push(`N${nodeId}`);

            // Return cached
            nodeId++;
            diagram += `    N${nodeId}[Return Cached]\n`;
            diagram += `    N${nodeId - 1} -->|Yes| N${nodeId}\n`;
            diagram += `    N${nodeId} --> End\n`;

            currentNode = decisionStack[decisionStack.length - 1];
            continue;
        }

        // Weight/capacity check (W>=wt[n-1] pattern)
        if (line.match(/if\s*\([^)]*>=.*\[/)) {
            nodeId++;
            complexity++;
            const cond = sanitize(line.replace(/^(?:else\s+)?if\s*\(?/, '').replace(/\).*$/, ''));
            diagram += `    N${nodeId}{Fits?<br/>${cond}}\n`;
            diagram += `    ${currentNode} --> N${nodeId}\n`;
            decisionStack.push(`N${nodeId}`);
            currentNode = `N${nodeId}`;
            continue;
        }

        // Recursive calls with assignment
        if (functions.some(f => line.includes(f + '(')) && line.includes('=') && !line.includes('return')) {
            nodeId++;
            const varMatch = line.match(/(\w+)\s*=/);
            const varName = varMatch ? sanitize(varMatch[1]) : 'result';
            diagram += `    N${nodeId}[Recursive:<br/>${varName}]\n`;
            diagram += `    ${currentNode} --> N${nodeId}\n`;
            currentNode = `N${nodeId}`;
            continue;
        }

        // Max/Min operations
        if ((hasMax || hasMin) && line.match(/return.*(?:max|min)\(/)) {
            nodeId++;
            diagram += `    N${nodeId}[Choose Best<br/>max/min]\n`;

            if (decisionStack.length > 0) {
                const lastDecision = decisionStack[decisionStack.length - 1];
                diagram += `    ${lastDecision} -->|Yes| N${nodeId}\n`;
            } else {
                diagram += `    ${currentNode} --> N${nodeId}\n`;
            }

            nodeId++;
            diagram += `    N${nodeId}[Store & Return]\n`;
            diagram += `    N${nodeId - 1} --> N${nodeId}\n`;
            diagram += `    N${nodeId} --> End\n`;
            continue;
        }

        // Simple return with recursive call
        if (line.match(/^return\s+\w+\(/) && !line.includes('max') && !line.includes('min')) {
            nodeId++;
            diagram += `    N${nodeId}[Recursive Call]\n`;

            if (decisionStack.length > 0) {
                const lastDecision = decisionStack.pop();
                diagram += `    ${lastDecision} -->|No| N${nodeId}\n`;
            } else {
                diagram += `    ${currentNode} --> N${nodeId}\n`;
            }

            nodeId++;
            diagram += `    N${nodeId}[Store & Return]\n`;
            diagram += `    N${nodeId - 1} --> N${nodeId}\n`;
            diagram += `    N${nodeId} --> End\n`;
            continue;
        }
    }

    diagram += '    End([End])\n';
    if (!diagram.includes(`${currentNode} --> End`) && decisionStack.length === 0) {
        diagram += `    ${currentNode} --> End\n`;
    }

    return { diagram, complexity };
}

export function generateClassDiagramLocally(code: string): { diagram: string; complexity: number } {
    const lines = code.split('\n');
    let classes: Map<string, { methods: string[]; fields: string[] }> = new Map();
    let currentClass = '';
    let complexity = 1;

    for (const line of lines) {
        const trimmed = line.trim();

        const classMatch = trimmed.match(/^class\s+(\w+)/);
        if (classMatch) {
            currentClass = classMatch[1];
            classes.set(currentClass, { methods: [], fields: [] });
            complexity++;
        }
        else if (currentClass && trimmed.match(/(?:int|void|bool|string)\s+(\w+)\s*\(/)) {
            const methodMatch = trimmed.match(/(?:int|void|bool|string)\s+(\w+)\s*\(/);
            if (methodMatch) {
                classes.get(currentClass)?.methods.push(`+${methodMatch[1]}()`);
            }
        }
        else if (currentClass && trimmed.match(/^(?:private|public|protected):/)) {
            continue; // Access specifier
        }
    }

    let diagram = 'classDiagram\n';

    if (classes.size === 0) {
        diagram += '    class Algorithm {\n';
        diagram += '        +execute()\n';
        diagram += '        +solve()\n';
        diagram += '    }\n';
    } else {
        classes.forEach((data, className) => {
            diagram += `    class ${className} {\n`;
            data.fields.forEach(field => diagram += `        ${field}\n`);
            data.methods.forEach(method => diagram += `        ${method}\n`);
            diagram += '    }\n';
        });
    }

    return { diagram, complexity };
}
