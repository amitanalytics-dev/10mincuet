/**
 * Sample paper data structure - Use this to seed the database
 * To use: Create a migration or scheduled function to insert these
 */

export const NEET_PAPERS = [
  {
    examType: "neet" as const,
    year: 2025,
    session: "Main",
    subjects: [
      {
        name: "Physics",
        subtopics: [
          { name: "Mechanics", bloomLevel: 3, marks: 32, questionCount: 8, pattern: "mcq" as const, frequency: 5 },
          { name: "Thermodynamics", bloomLevel: 3, marks: 24, questionCount: 6, pattern: "mcq" as const, frequency: 4 },
          { name: "Waves & Sound", bloomLevel: 2, marks: 16, questionCount: 4, pattern: "mcq" as const, frequency: 3 },
          { name: "Electrostatics", bloomLevel: 4, marks: 28, questionCount: 7, pattern: "mcq" as const, frequency: 5 },
        ],
        totalMarks: 180,
        totalQuestions: 45,
      },
      {
        name: "Chemistry",
        subtopics: [
          { name: "Organic Chemistry", bloomLevel: 4, marks: 40, questionCount: 10, pattern: "mcq" as const, frequency: 5 },
          { name: "Inorganic Chemistry", bloomLevel: 3, marks: 32, questionCount: 8, pattern: "mcq" as const, frequency: 4 },
          { name: "Physical Chemistry", bloomLevel: 3, marks: 36, questionCount: 9, pattern: "mcq" as const, frequency: 5 },
        ],
        totalMarks: 180,
        totalQuestions: 45,
      },
      {
        name: "Biology",
        subtopics: [
          { name: "Cell Biology", bloomLevel: 2, marks: 20, questionCount: 5, pattern: "mcq" as const, frequency: 4 },
          { name: "Genetics", bloomLevel: 4, marks: 36, questionCount: 9, pattern: "mcq" as const, frequency: 5 },
          { name: "Ecology", bloomLevel: 2, marks: 24, questionCount: 6, pattern: "mcq" as const, frequency: 3 },
          { name: "Human Physiology", bloomLevel: 3, marks: 40, questionCount: 10, pattern: "mcq" as const, frequency: 5 },
          { name: "Botany", bloomLevel: 3, marks: 20, questionCount: 5, pattern: "mcq" as const, frequency: 3 },
        ],
        totalMarks: 180,
        totalQuestions: 45,
      },
    ],
    totalMarks: 720,
    createdAt: Date.now(),
  },
  // Add similar structures for 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013
  // Plus AIPMT years (2012-2005)
];

export const JEE_PAPERS = [
  {
    examType: "jee" as const,
    year: 2025,
    session: "Session 2",
    shift: 1,
    subjects: [
      {
        name: "Physics",
        subtopics: [
          { name: "Mechanics (Kinematics)", bloomLevel: 3, marks: 15, questionCount: 3, pattern: "mcq" as const, frequency: 5 },
          { name: "Mechanics (Dynamics)", bloomLevel: 4, marks: 20, questionCount: 4, pattern: "numeric" as const, frequency: 5 },
          { name: "Circular Motion", bloomLevel: 3, marks: 10, questionCount: 2, pattern: "mcq" as const, frequency: 4 },
          { name: "Gravity & Space", bloomLevel: 2, marks: 10, questionCount: 2, pattern: "mcq" as const, frequency: 3 },
        ],
        totalMarks: 100,
        totalQuestions: 20,
      },
      {
        name: "Chemistry",
        subtopics: [
          { name: "Organic (Hydrocarbons)", bloomLevel: 4, marks: 15, questionCount: 3, pattern: "mcq" as const, frequency: 5 },
          { name: "Organic (Reactions)", bloomLevel: 4, marks: 20, questionCount: 4, pattern: "numeric" as const, frequency: 5 },
          { name: "Coordination Compounds", bloomLevel: 3, marks: 15, questionCount: 3, pattern: "mcq" as const, frequency: 4 },
          { name: "Thermodynamics", bloomLevel: 3, marks: 10, questionCount: 2, pattern: "mcq" as const, frequency: 4 },
        ],
        totalMarks: 100,
        totalQuestions: 20,
      },
      {
        name: "Mathematics",
        subtopics: [
          { name: "Algebra (Quadratics)", bloomLevel: 3, marks: 10, questionCount: 2, pattern: "mcq" as const, frequency: 5 },
          { name: "Algebra (Complex Numbers)", bloomLevel: 4, marks: 15, questionCount: 3, pattern: "numeric" as const, frequency: 4 },
          { name: "Calculus (Limits)", bloomLevel: 3, marks: 15, questionCount: 3, pattern: "mcq" as const, frequency: 5 },
          { name: "Calculus (Derivatives)", bloomLevel: 4, marks: 20, questionCount: 4, pattern: "numeric" as const, frequency: 5 },
          { name: "Vectors", bloomLevel: 3, marks: 10, questionCount: 2, pattern: "mcq" as const, frequency: 3 },
        ],
        totalMarks: 100,
        totalQuestions: 20,
      },
    ],
    totalMarks: 300,
    createdAt: Date.now(),
  },
  // Add 2024-2013 papers + AIEEE 2012-2002
];

export const CUET_PAPERS = [
  {
    examType: "cuet" as const,
    year: 2025,
    session: "Main",
    subjects: [
      {
        name: "Physics",
        subtopics: [
          { name: "Mechanics", bloomLevel: 3, marks: 8, questionCount: 8, pattern: "mcq" as const, frequency: 4 },
          { name: "Thermodynamics", bloomLevel: 3, marks: 6, questionCount: 6, pattern: "mcq" as const, frequency: 3 },
          { name: "Waves", bloomLevel: 2, marks: 4, questionCount: 4, pattern: "mcq" as const, frequency: 2 },
        ],
        totalMarks: 50,
        totalQuestions: 50,
      },
      {
        name: "Chemistry",
        subtopics: [
          { name: "Organic Chemistry", bloomLevel: 4, marks: 12, questionCount: 12, pattern: "mcq" as const, frequency: 5 },
          { name: "Inorganic Chemistry", bloomLevel: 3, marks: 16, questionCount: 16, pattern: "mcq" as const, frequency: 4 },
          { name: "Physical Chemistry", bloomLevel: 3, marks: 12, questionCount: 12, pattern: "mcq" as const, frequency: 4 },
        ],
        totalMarks: 50,
        totalQuestions: 50,
      },
      {
        name: "Biology",
        subtopics: [
          { name: "Genetics", bloomLevel: 4, marks: 14, questionCount: 14, pattern: "mcq" as const, frequency: 5 },
          { name: "Ecology", bloomLevel: 2, marks: 10, questionCount: 10, pattern: "mcq" as const, frequency: 3 },
          { name: "Human Physiology", bloomLevel: 3, marks: 14, questionCount: 14, pattern: "mcq" as const, frequency: 4 },
          { name: "Cell Biology", bloomLevel: 2, marks: 12, questionCount: 12, pattern: "mcq" as const, frequency: 3 },
        ],
        totalMarks: 50,
        totalQuestions: 50,
      },
      {
        name: "General Test",
        subtopics: [
          { name: "Reasoning", bloomLevel: 2, marks: 10, questionCount: 10, pattern: "mcq" as const, frequency: 4 },
          { name: "Quantitative Ability", bloomLevel: 3, marks: 15, questionCount: 15, pattern: "mcq" as const, frequency: 5 },
          { name: "English Comprehension", bloomLevel: 2, marks: 10, questionCount: 10, pattern: "mcq" as const, frequency: 4 },
        ],
        totalMarks: 50,
        totalQuestions: 50,
      },
    ],
    totalMarks: 200,
    createdAt: Date.now(),
  },
  // Add 2024, 2023, 2022
];
