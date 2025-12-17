// Type definitions for Arch-Gen

export type DiagramType = 'flowchart' | 'class';

export type Language = 'python' | 'javascript' | 'typescript' | 'cpp' | 'java';

export interface VisualizeRequest {
  code: string;
  diagramType?: DiagramType;
  language?: Language;
}

export interface VisualizeResponse {
  result: string;
  complexity?: number;
  error?: string;
}

export interface CodeExample {
  name: string;
  language: Language;
  code: string;
  description: string;
}

export interface ComplexityMetrics {
  score: number;
  level: 'low' | 'medium' | 'high';
  description: string;
}
