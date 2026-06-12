// Foundation (Class 6–10) practice questions. Free access. Client-safe.
// topicSlug = slugify(topic.name) from foundation-topics.ts.
import type { ClassLevel, FoundationSubject } from "./foundation-topics";

export type FoundationQuestion = {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  classLevel: ClassLevel;
  subject: FoundationSubject;
  topicSlug: string;
};

export const FOUNDATION_QUESTIONS: FoundationQuestion[] = [
  // ── Class 6 ──
  { id: "f6-sci-1", classLevel: "6", subject: "Science", topicSlug: "food-where-does-it-come-from", text: "An animal that eats only plants is called a:", options: ["Carnivore", "Herbivore", "Omnivore", "Decomposer"], correct: 1, explanation: "Herbivores eat only plants; carnivores eat animals; omnivores eat both." },
  { id: "f6-sci-2", classLevel: "6", subject: "Science", topicSlug: "electricity-and-circuits", text: "Which material allows electric current to pass through it?", options: ["Rubber", "Plastic", "Copper", "Wood"], correct: 2, explanation: "Copper is a conductor; rubber, plastic and wood are insulators." },
  { id: "f6-mat-1", classLevel: "6", subject: "Maths", topicSlug: "fractions", text: "Which fraction is equal to 1/2?", options: ["2/3", "3/6", "2/5", "4/9"], correct: 1, explanation: "3/6 simplifies to 1/2." },
  { id: "f6-mat-2", classLevel: "6", subject: "Maths", topicSlug: "knowing-our-numbers", text: "The place value of 7 in 4,732 is:", options: ["7", "70", "700", "7000"], correct: 2, explanation: "7 is in the hundreds place, so its value is 700." },
  { id: "f6-sst-1", classLevel: "6", subject: "Social Science", topicSlug: "the-earth-in-the-solar-system", text: "Which is the closest planet to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correct: 2, explanation: "Mercury is the planet nearest to the Sun." },
  { id: "f6-eng-1", classLevel: "6", subject: "English", topicSlug: "nouns-and-pronouns", text: "Which word is a pronoun?", options: ["Run", "She", "Apple", "Quickly"], correct: 1, explanation: "'She' replaces a noun, so it is a pronoun." },

  // ── Class 7 ──
  { id: "f7-sci-1", classLevel: "7", subject: "Science", topicSlug: "acids-bases-and-salts", text: "Litmus turns red in the presence of a/an:", options: ["Base", "Acid", "Salt", "Neutral solution"], correct: 1, explanation: "Acids turn blue litmus red." },
  { id: "f7-sci-2", classLevel: "7", subject: "Science", topicSlug: "respiration-in-organisms", text: "During respiration, glucose is broken down to release:", options: ["Light", "Energy", "Sound", "Water only"], correct: 1, explanation: "Respiration releases energy stored in glucose." },
  { id: "f7-mat-1", classLevel: "7", subject: "Maths", topicSlug: "integers", text: "The value of (−5) + 3 is:", options: ["−2", "2", "−8", "8"], correct: 0, explanation: "(−5) + 3 = −2." },
  { id: "f7-mat-2", classLevel: "7", subject: "Maths", topicSlug: "simple-equations", text: "If x + 4 = 9, then x equals:", options: ["5", "13", "4", "9"], correct: 0, explanation: "x = 9 − 4 = 5." },
  { id: "f7-sst-1", classLevel: "7", subject: "Social Science", topicSlug: "the-mughal-empire", text: "Who was the founder of the Mughal Empire in India?", options: ["Akbar", "Babur", "Shah Jahan", "Aurangzeb"], correct: 1, explanation: "Babur founded the Mughal Empire after the First Battle of Panipat in 1526." },
  { id: "f7-eng-1", classLevel: "7", subject: "English", topicSlug: "tenses", text: "Choose the past tense: 'She ___ to school yesterday.'", options: ["go", "goes", "went", "going"], correct: 2, explanation: "'Yesterday' signals past tense — 'went'." },

  // ── Class 8 ──
  { id: "f8-sci-1", classLevel: "8", subject: "Science", topicSlug: "force-and-pressure", text: "Pressure is defined as force per unit:", options: ["Time", "Area", "Mass", "Length"], correct: 1, explanation: "Pressure = Force / Area." },
  { id: "f8-sci-2", classLevel: "8", subject: "Science", topicSlug: "cell-structure-and-functions", text: "The control centre of a cell is the:", options: ["Cytoplasm", "Cell wall", "Nucleus", "Vacuole"], correct: 2, explanation: "The nucleus controls the cell's activities." },
  { id: "f8-mat-1", classLevel: "8", subject: "Maths", topicSlug: "comparing-quantities", text: "20% of 150 is:", options: ["30", "25", "20", "15"], correct: 0, explanation: "20% of 150 = 0.2 × 150 = 30." },
  { id: "f8-mat-2", classLevel: "8", subject: "Maths", topicSlug: "linear-equations-in-one-variable", text: "Solve: 3x = 18. x = ?", options: ["3", "6", "9", "15"], correct: 1, explanation: "x = 18 / 3 = 6." },
  { id: "f8-sst-1", classLevel: "8", subject: "Social Science", topicSlug: "the-indian-constitution", text: "The Indian Constitution came into force in the year:", options: ["1947", "1950", "1935", "1952"], correct: 1, explanation: "The Constitution came into effect on 26 January 1950." },
  { id: "f8-eng-1", classLevel: "8", subject: "English", topicSlug: "active-and-passive-voice", text: "Passive of 'The cat chased the mouse' is: 'The mouse ___ by the cat.'", options: ["chased", "was chased", "is chasing", "chases"], correct: 1, explanation: "Passive past simple: 'was chased'." },

  // ── Class 9 ──
  { id: "f9-sci-1", classLevel: "9", subject: "Science", topicSlug: "motion", text: "A body covering equal distances in equal intervals of time has:", options: ["Acceleration", "Uniform speed", "Zero speed", "Variable speed"], correct: 1, explanation: "Equal distances in equal times means uniform speed." },
  { id: "f9-sci-2", classLevel: "9", subject: "Science", topicSlug: "atoms-and-molecules", text: "The smallest particle of an element that retains its properties is a/an:", options: ["Molecule", "Atom", "Ion", "Compound"], correct: 1, explanation: "An atom is the smallest particle of an element." },
  { id: "f9-mat-1", classLevel: "9", subject: "Maths", topicSlug: "polynomials", text: "The degree of the polynomial 3x² + 2x + 1 is:", options: ["1", "2", "3", "0"], correct: 1, explanation: "The highest power of x is 2, so degree = 2." },
  { id: "f9-mat-2", classLevel: "9", subject: "Maths", topicSlug: "coordinate-geometry", text: "The point (0, 5) lies on the:", options: ["x-axis", "y-axis", "origin", "line y = x"], correct: 1, explanation: "A point with x = 0 lies on the y-axis." },
  { id: "f9-sst-1", classLevel: "9", subject: "Social Science", topicSlug: "what-is-democracy", text: "In a democracy, the rulers are elected by the:", options: ["Army", "People", "King", "Judges"], correct: 1, explanation: "Democracy means rule by the people through elected representatives." },
  { id: "f9-eng-1", classLevel: "9", subject: "English", topicSlug: "sentence-rearrangement", text: "Which sentence best starts a paragraph?", options: ["Therefore it ended.", "However, they refused.", "India is a vast country.", "So we agreed."], correct: 2, explanation: "An independent opening sentence introduces the topic without a connector." },

  // ── Class 10 ──
  { id: "f10-sci-1", classLevel: "10", subject: "Science", topicSlug: "light-reflection-and-refraction", text: "The focal length of a concave mirror with radius of curvature 20 cm is:", options: ["20 cm", "10 cm", "40 cm", "5 cm"], correct: 1, explanation: "f = R/2 = 20/2 = 10 cm." },
  { id: "f10-sci-2", classLevel: "10", subject: "Science", topicSlug: "chemical-reactions-and-equations", text: "Rusting of iron is an example of a/an:", options: ["Displacement reaction", "Oxidation reaction", "Decomposition reaction", "Neutralisation"], correct: 1, explanation: "Rusting is oxidation of iron in the presence of air and moisture." },
  { id: "f10-sci-3", classLevel: "10", subject: "Science", topicSlug: "life-processes", text: "Which organ in humans filters blood to form urine?", options: ["Liver", "Heart", "Kidney", "Lung"], correct: 2, explanation: "The kidneys filter blood and produce urine." },
  { id: "f10-mat-1", classLevel: "10", subject: "Maths", topicSlug: "quadratic-equations", text: "The roots of x² − 5x + 6 = 0 are:", options: ["2 and 3", "1 and 6", "−2 and −3", "5 and 6"], correct: 0, explanation: "Factor: (x−2)(x−3) = 0, so x = 2 or 3." },
  { id: "f10-mat-2", classLevel: "10", subject: "Maths", topicSlug: "trigonometry-intro", text: "The value of sin 30° is:", options: ["1", "1/2", "√3/2", "0"], correct: 1, explanation: "sin 30° = 1/2." },
  { id: "f10-mat-3", classLevel: "10", subject: "Maths", topicSlug: "statistics", text: "The mean of 4, 6, 8, 10 is:", options: ["6", "7", "8", "9"], correct: 1, explanation: "Mean = (4+6+8+10)/4 = 28/4 = 7." },
  { id: "f10-sst-1", classLevel: "10", subject: "Social Science", topicSlug: "nationalism-in-india", text: "The Non-Cooperation Movement was led by:", options: ["Bhagat Singh", "Mahatma Gandhi", "Subhas Bose", "Nehru"], correct: 1, explanation: "Gandhi led the Non-Cooperation Movement (1920–22)." },
  { id: "f10-sst-2", classLevel: "10", subject: "Social Science", topicSlug: "development-economics", text: "Which is a key indicator of a country's development?", options: ["Number of cars", "Per capita income", "Area of land", "Number of rivers"], correct: 1, explanation: "Per capita income is a standard development indicator." },
  { id: "f10-eng-1", classLevel: "10", subject: "English", topicSlug: "editing-and-error-correction", text: "Correct the error: 'He don't like tea.'", options: ["He doesn't like tea.", "He not like tea.", "He don't likes tea.", "He didn't likes tea."], correct: 0, explanation: "Third-person singular needs 'doesn't': 'He doesn't like tea.'" },
  { id: "f10-eng-2", classLevel: "10", subject: "English", topicSlug: "advanced-comprehension", text: "If a passage describes a character as 'reluctant', the character is:", options: ["Eager", "Unwilling", "Angry", "Joyful"], correct: 1, explanation: "'Reluctant' means hesitant or unwilling." },

  // a couple more to reach 40, spread across classes
  { id: "f6-eng-2", classLevel: "6", subject: "English", topicSlug: "reading-short-passages", text: "Reading 'The sky grew dark and it began to rain', what happened?", options: ["It was sunny", "It rained", "It snowed", "It was windy only"], correct: 1, explanation: "The passage directly says it began to rain." },
  { id: "f6-sst-2", classLevel: "6", subject: "Social Science", topicSlug: "what-where-how-and-when-history", text: "Which of these is a source of history?", options: ["Inscriptions", "Clouds", "Wind", "Rainfall"], correct: 0, explanation: "Inscriptions are written historical sources." },
  { id: "f7-sst-2", classLevel: "7", subject: "Social Science", topicSlug: "our-environment", text: "The thin layer of soil and rock that supports life is part of the:", options: ["Atmosphere", "Lithosphere", "Stratosphere", "Ionosphere"], correct: 1, explanation: "The lithosphere is the solid outer layer that supports life." },
  { id: "f8-sst-2", classLevel: "8", subject: "Social Science", topicSlug: "resources", text: "Sunlight and wind are examples of ___ resources.", options: ["Non-renewable", "Renewable", "Human-made", "Exhaustible"], correct: 1, explanation: "Sunlight and wind are renewable resources." },
];

export function getFoundationQuestions(
  classLevel: string,
  subject: string,
  topicSlug: string
): FoundationQuestion[] {
  return FOUNDATION_QUESTIONS.filter(
    (q) =>
      q.classLevel === classLevel &&
      q.subject.toLowerCase() === subject.toLowerCase() &&
      q.topicSlug === topicSlug
  );
}
