const getLangPrefix = (lang?: string) => lang ? `written in ${lang}` : '';

// JSON-based approach for 100% reliability
export const JSON_FLOWCHART_PROMPT = (code: string, language?: string) => `You are an expert Software Architect.
Analyze the code ${getLangPrefix(language)} and return a JSON object representing a Mermaid flowchart.
Do NOT return Markdown. Return ONLY valid JSON.

STRICT INSTRUCTION: AUTO-DETECT LANGUAGE
1. Analyze the code syntax to determine the programming language.
2. If the code is valid in ANY major language (Python, C++, Java, JS, etc.), generate the flowchart.
3. Ignore any previous language labels. Trust the code syntax.
4. If the code is gibberish or not code, return an Error Node.

JSON Structure (for valid code):

JSON Structure:
{
  "direction": "TD",
  "nodes": [
    { "id": "A", "label": "Start", "type": "circle" },  // type can be: rect, rhombus, circle, cylinder, subroutine
    { "id": "B", "label": "Process", "type": "rect" }
  ],
  "edges": [
    { "from": "A", "to": "B", "label": null },      // label is optional string
    { "from": "B", "to": "C", "label": "result" }
  ]
}

CRITICAL RULES:
1. "type": "rect" -> [Label], "rhombus" -> {Label}, "circle" -> ((Label)), "cylinder" -> [(Label)], "subroutine" -> [[Label]]
2. Keep labels concise.
3. Ensure logical flow.

CODE TO ANALYZE:
${code}`;

export const constructMermaidFromJSON = (jsonString: string): string => {
    try {
        // Strip markdown fences if present
        const cleanJson = jsonString.replace(/```json\n?|\n?```/gi, '').trim();
        const data = JSON.parse(cleanJson);

        let mermaid = `graph ${data.direction || 'TD'}\n`;

        // Add nodes
        data.nodes.forEach((node: any) => {
            let shapeOpen = '[', shapeClose = ']';
            switch (node.type) {
                case 'rhombus': shapeOpen = '{'; shapeClose = '}'; break;
                case 'circle': shapeOpen = '(('; shapeClose = '))'; break;
                case 'cylinder': shapeOpen = '[('; shapeClose = ')]'; break;
                case 'subroutine': shapeOpen = '[['; shapeClose = ']]'; break;
                default: shapeOpen = '['; shapeClose = ']';
            }
            // Sanitize label
            const label = (node.label || '').replace(/["()[\]{}]/g, '');
            mermaid += `    ${node.id}${shapeOpen}${label}${shapeClose}\n`;
        });

        // Add edges
        data.edges.forEach((edge: any) => {
            const arrow = edge.label ? `--|${edge.label.replace(/"/g, '')}|-->` : '-->';
            mermaid += `    ${edge.from} ${arrow} ${edge.to}\n`;
        });

        return mermaid;
    } catch (e) {
        console.error("JSON Parse Error:", e);
        return "graph TD\n    Error[Failed to parse AI response]";
    }
};

// ... keep existing functions for backward compatibility/fallback ...
export const FLOWCHART_PROMPT = (code: string, language?: string) => `You are an expert Software Architect.
// ... (rest of simple prompt as fallback)
Analyze the following code ${getLangPrefix(language)} and generate a Mermaid.js flowchart.

CRITICAL RULES:
1. OUTPUT FORMAT: Return ONLY the Mermaid code. No markdown backticks, no explanations.
2. SYNTAX: Start with "graph TD" or "graph LR".
3. SHAPES: Use [Rectangle], {Rhombus}, ((Circle)), [[Subroutine]]
4. ONE STATEMENT PER LINE: Each edge must be on its own line.
5. LABELS: Keep text short (max 30 chars). Avoid special characters.
6. Use --> for flow, --|label|--> for labeled edges

CORRECT FORMAT:
graph TD
    A((Start)) --> B[Process]
    B --> C{Condition?}
    C --|true| D[Action]
    C --|false| E[Other]
    D --> F((End))
    E --> F

CODE TO ANALYZE:
${code}

OUTPUT ONLY THE MERMAID CODE:`;

export const CLASS_DIAGRAM_PROMPT = (code: string, language?: string) => `You are an expert Software Architect.
Analyze the following code ${getLangPrefix(language)} and generate a Mermaid.js class diagram.

CRITICAL RULES:
1. OUTPUT FORMAT: Return ONLY the Mermaid code. No markdown backticks.
2. Start with "classDiagram".
3. Use +method() for public, -field for private, #method() for protected
4. Keep names concise

CODE TO ANALYZE:
${code}

OUTPUT ONLY THE MERMAID CODE:`;

export const extractComplexity = (mermaidCode: string): number => {
    const complexityMatch = mermaidCode.match(/%%\s*Complexity:\s*(\d+)/i);
    if (complexityMatch) {
        return parseInt(complexityMatch[1], 10);
    }
    const decisionNodes = (mermaidCode.match(/\{[^}]+\}/g) || []).length;
    return decisionNodes + 1;
};

export const cleanMermaidCode = (code: string): string => {
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
    cleaned = cleaned.replace(/\[(?!\(|\[)([^\]]+)\](?!\])/g, (match, label, offset, fullStr) => {
        if (offset > 0 && fullStr[offset - 1] === '[') return match;
        const sanitized = label.replace(/\[/g, '(').replace(/\]/g, ')').replace(/"/g, "'");
        return `[${sanitized}]`;
    });

    // SMART SPLIT: Split multi-statement lines using robust regex
    // Matches: Closing bracket/brace/paren -> 2+ Whitespaces -> Letter (Start of next ID/Class)
    // Heuristic: 2+ spaces ensures we don't split inside labels like "(words  text)"
    cleaned = cleaned.replace(/([)\]}])\s{2,}([a-zA-Z][\w]*)/g, '$1\n    $2');

    return cleaned;
};
