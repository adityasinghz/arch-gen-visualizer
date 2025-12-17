
const cleanMermaidCode = (code) => {
    let cleaned = code.replace(/```mermaid\n?/gi, '').replace(/```\n?/g, '').trim();
    cleaned = cleaned.replace(/%%\s*Complexity:\s*\d+/gi, '');

    // Fix cylinder shapes: [(label]] -> [(label)]
    cleaned = cleaned.replace(/\[\(([^\)]+)\]\]/g, '[($1)]');

    // Fix subroutine shapes: [[label] -> [[label]]
    cleaned = cleaned.replace(/\[\[([^\]]+)\](?!\])/g, '[[$1]]');

    // Sanitize diamond labels
    cleaned = cleaned.replace(/\{([^}]+)\}/g, (match, label) => {
        const sanitized = label.replace(/\[/g, '(').replace(/\]/g, ')').replace(/"/g, "'");
        return `{${sanitized}}`;
    });

    // Sanitize rectangle labels - but NOT [(text) or [[text
    cleaned = cleaned.replace(/\[(?!\(|\[)([^\]]+)\](?!\])/g, (match, label, offset, string) => {
        if (offset > 0 && string[offset - 1] === '[') return match;
        const sanitized = label.replace(/\[/g, '(').replace(/\]/g, ')').replace(/"/g, "'");
        return `[${sanitized}]`;
    });

    // CURRENT IMPLEMENTATION TO TEST
    const lines = cleaned.split('\n');
    const fixedLines = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('graph ') || trimmed.startsWith('classDiagram') || !trimmed) {
            fixedLines.push(line);
            continue;
        }

        let currentLine = trimmed;
        const parts = [];
        let buffer = '';

        for (let i = 0; i < currentLine.length; i++) {
            buffer += currentLine[i];

            if ((currentLine[i] === ']' || currentLine[i] === '}' || currentLine[i] === ')')) {
                if (i + 1 < currentLine.length) {
                    let spaceCount = 0;
                    let j = i + 1;
                    while (j < currentLine.length && currentLine[j] === ' ') {
                        spaceCount++;
                        j++;
                    }

                    if (spaceCount >= 2 && j < currentLine.length && /[A-Z]/.test(currentLine[j])) {
                        parts.push(buffer.trim());
                        buffer = '';
                        i = j - 1;
                    }
                }
            }
        }

        if (buffer.trim()) {
            parts.push(buffer.trim());
        }

        if (parts.length > 1) {
            parts.forEach(part => fixedLines.push('    ' + part));
        } else {
            fixedLines.push(line);
        }
    }

    return fixedLines.join('\n');
};

const failingInput = `graph TD
    A((Start)) --> B[Check creds]
    B --> C{Credentials?}
    C --|no| D[Error: Missing]    C --|yes| E[Find user]`;

console.log("Original:");
console.log(failingInput);
console.log("\nCleaned:");
console.log(cleanMermaidCode(failingInput));
