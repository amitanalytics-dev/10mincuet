export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate';

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
  subConcept: string;
  bloomLevel: BloomLevel;
  section?: 'Languages' | 'Domain' | 'GeneralTest';
}

export type { Question as CUETQuestion };
