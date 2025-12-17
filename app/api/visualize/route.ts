import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { FLOWCHART_PROMPT, CLASS_DIAGRAM_PROMPT, extractComplexity, cleanMermaidCode, JSON_FLOWCHART_PROMPT, constructMermaidFromJSON } from '@/lib/prompts';
import { generateFlowchartLocally, generateClassDiagramLocally } from '@/lib/localGenerator';
import type { VisualizeRequest, VisualizeResponse } from '@/types';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    // Parse body first so variables are available in catch block
    const body: VisualizeRequest = await req.json();
    const { code, diagramType = 'flowchart', language } = body;

    try {
        // Validate input
        if (!code || code.trim().length === 0) {
            return NextResponse.json(
                { error: 'No code provided' } as VisualizeResponse,
                { status: 400 }
            );
        }

        // Check API key - use local generator as fallback
        if (!process.env.OPENAI_API_KEY) {
            console.log('No OpenAI API key found, using local generator');
            const result = diagramType === 'class'
                ? generateClassDiagramLocally(code)
                : generateFlowchartLocally(code);

            return NextResponse.json({
                result: result.diagram,
                complexity: result.complexity,
            } as VisualizeResponse);
        }

        // Select appropriate prompt based on diagram type
        let prompt;
        if (diagramType === 'class') {
            prompt = CLASS_DIAGRAM_PROMPT(code, language);
        } else {
            // Use JSON prompt for flowcharts (much more reliable)
            prompt = JSON_FLOWCHART_PROMPT(code, language);
        }

        console.log('Generating diagram with OpenAI GPT-4o-mini (JSON mode)...');

        // Self-healing approach: Try up to 2 times if syntax errors occur
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                // For flowcharts, we expect JSON. For class diagrams, we still get text.
                const isJsonMode = diagramType !== 'class';

                const systemPrompt = isJsonMode
                    ? 'You are a code analysis expert. Return VALID JSON only.'
                    : 'You are a code analysis expert. Return valid Mermaid code.';

                const completion = await openai.chat.completions.create({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    response_format: isJsonMode ? { type: "json_object" } : { type: "text" },
                    temperature: 0.1,
                    max_tokens: 2048,
                });

                const generatedText = completion.choices[0]?.message?.content || '';
                let finalMermaid = '';
                let complexity = 5; // Default

                if (isJsonMode) {
                    // Reconstruct Mermaid from JSON
                    finalMermaid = constructMermaidFromJSON(generatedText);
                    // Estimate complexity from JSON structure roughly
                    complexity = (finalMermaid.match(/-->/g) || []).length + 2;
                } else {
                    // Legacy text mode for class diagrams
                    finalMermaid = cleanMermaidCode(generatedText);
                    complexity = extractComplexity(generatedText);
                }

                console.log('===== GENERATED MERMAID CODE =====');
                console.log(finalMermaid);
                console.log('===== END MERMAID CODE =====');
                console.log('Complexity score:', complexity);

                // Validate that we got something that looks like Mermaid
                if (!finalMermaid.includes('graph') && !finalMermaid.includes('classDiagram')) {
                    throw new Error('Invalid Mermaid syntax from AI');
                }

                // SUCCESS! Return the diagram
                return NextResponse.json({
                    result: finalMermaid,
                    complexity: complexity,
                } as VisualizeResponse);

            } catch (aiError: any) {
                console.log(`Attempt ${attempt + 1} failed:`, aiError.message);

                // If this was the last attempt, fall back to local generator
                if (attempt === 1) {
                    throw aiError;
                }

                // Otherwise, loop will retry with different prompt
                continue;
            }
        }

        // Should never reach here, but just in case
        throw new Error('All generation attempts failed');

    } catch (error: any) {
        console.log('OpenAI API failed, using local generator as fallback:', error.message);

        // Fallback to local generation
        const result = diagramType === 'class'
            ? generateClassDiagramLocally(code)
            : generateFlowchartLocally(code);

        return NextResponse.json({
            result: result.diagram,
            complexity: result.complexity,
        } as VisualizeResponse);
    }
}
