// Foundation track (NCERT Classes 6–10). Builds the conceptual base that later
// feeds into CUET UG domain / General Test topics. `feedsInto` maps each
// foundation chapter to the CUET topic slug(s) it prepares the student for.

export type FoundationSubject = "Science" | "Maths" | "Social Science" | "English";
export type ClassLevel = "6" | "7" | "8" | "9" | "10";

export type FoundationTopic = {
  name: string;
  summary: string;
  feedsInto: string[]; // CUET topic slugs (slugify of topics.ts topic names)
};

export type FoundationSubjectBlock = {
  subject: FoundationSubject;
  color: string;
  accent: string;
  topics: FoundationTopic[];
};

export type FoundationClass = {
  classLevel: ClassLevel;
  label: string;
  subjects: FoundationSubjectBlock[];
};

export const foundationClasses: FoundationClass[] = [
  {
    classLevel: "6",
    label: "Class 6",
    subjects: [
      {
        subject: "Science",
        color: "emerald",
        accent: "#059669",
        topics: [
          { name: "Food: Where Does It Come From", summary: "Sources of food, herbivores, carnivores and omnivores.", feedsInto: ["cell-biology-and-genetics", "ecology-and-environment"] },
          { name: "Separation of Substances", summary: "Methods like filtration, evaporation and sedimentation.", feedsInto: ["equilibrium-and-thermodynamics"] },
          { name: "Electricity and Circuits", summary: "Simple circuits, conductors and insulators.", feedsInto: ["current-electricity"] },
        ],
      },
      {
        subject: "Maths",
        color: "indigo",
        accent: "#6366F1",
        topics: [
          { name: "Knowing Our Numbers", summary: "Place value, comparing and rounding large numbers.", feedsInto: ["quantitative-aptitude", "general-mental-ability"] },
          { name: "Fractions", summary: "Proper, improper fractions and basic operations.", feedsInto: ["quantitative-aptitude"] },
          { name: "Basic Geometry", summary: "Points, lines, angles and simple shapes.", feedsInto: ["coordinate-geometry-and-vectors"] },
        ],
      },
      {
        subject: "Social Science",
        color: "orange",
        accent: "#EA580C",
        topics: [
          { name: "What, Where, How and When (History)", summary: "Sources of history and early settlements.", feedsInto: ["ancient-india"] },
          { name: "The Earth in the Solar System", summary: "Planets, the globe and latitudes-longitudes.", feedsInto: ["physical-geography"] },
        ],
      },
      {
        subject: "English",
        color: "rose",
        accent: "#E11D48",
        topics: [
          { name: "Reading Short Passages", summary: "Understanding simple stories and answering questions.", feedsInto: ["reading-comprehension"] },
          { name: "Nouns and Pronouns", summary: "Identifying naming words and their replacements.", feedsInto: ["grammar-and-sentence-correction"] },
        ],
      },
    ],
  },
  {
    classLevel: "7",
    label: "Class 7",
    subjects: [
      {
        subject: "Science",
        color: "emerald",
        accent: "#059669",
        topics: [
          { name: "Acids, Bases and Salts", summary: "Indicators, neutralisation and everyday acids/bases.", feedsInto: ["equilibrium-and-thermodynamics", "inorganic-chemistry"] },
          { name: "Heat", summary: "Temperature, conduction, convection and radiation.", feedsInto: ["equilibrium-and-thermodynamics"] },
          { name: "Respiration in Organisms", summary: "Breathing in humans, animals and plants.", feedsInto: ["human-physiology", "plant-physiology"] },
        ],
      },
      {
        subject: "Maths",
        color: "indigo",
        accent: "#6366F1",
        topics: [
          { name: "Integers", summary: "Operations on positive and negative numbers.", feedsInto: ["quantitative-aptitude", "algebra"] },
          { name: "Simple Equations", summary: "Forming and solving one-variable equations.", feedsInto: ["algebra"] },
          { name: "Ratio and Proportion", summary: "Comparing quantities and unitary method.", feedsInto: ["quantitative-aptitude"] },
        ],
      },
      {
        subject: "Social Science",
        color: "orange",
        accent: "#EA580C",
        topics: [
          { name: "The Mughal Empire", summary: "Rise and administration of the Mughals.", feedsInto: ["medieval-india"] },
          { name: "Our Environment", summary: "Natural and human environment, ecosystems.", feedsInto: ["physical-geography", "ecology-and-environment"] },
        ],
      },
      {
        subject: "English",
        color: "rose",
        accent: "#E11D48",
        topics: [
          { name: "Comprehension Practice", summary: "Inference and main-idea questions on passages.", feedsInto: ["reading-comprehension"] },
          { name: "Tenses", summary: "Past, present and future tense usage.", feedsInto: ["grammar-and-sentence-correction"] },
        ],
      },
    ],
  },
  {
    classLevel: "8",
    label: "Class 8",
    subjects: [
      {
        subject: "Science",
        color: "emerald",
        accent: "#059669",
        topics: [
          { name: "Force and Pressure", summary: "Contact and non-contact forces, pressure in fluids.", feedsInto: ["current-electricity", "magnetism-and-emi"] },
          { name: "Chemical Effects of Electric Current", summary: "Conduction in liquids and electroplating.", feedsInto: ["electrochemistry-and-kinetics", "current-electricity"] },
          { name: "Cell — Structure and Functions", summary: "Plant and animal cells, organelles.", feedsInto: ["cell-biology-and-genetics"] },
        ],
      },
      {
        subject: "Maths",
        color: "indigo",
        accent: "#6366F1",
        topics: [
          { name: "Linear Equations in One Variable", summary: "Solving and applying linear equations.", feedsInto: ["algebra"] },
          { name: "Comparing Quantities", summary: "Percentage, profit-loss and simple interest.", feedsInto: ["quantitative-aptitude"] },
          { name: "Mensuration", summary: "Area and volume of basic solids.", feedsInto: ["general-mental-ability"] },
        ],
      },
      {
        subject: "Social Science",
        color: "orange",
        accent: "#EA580C",
        topics: [
          { name: "The Indian Constitution", summary: "Why we need a constitution; key features.", feedsInto: ["indian-constitution-and-politics"] },
          { name: "Resources", summary: "Types of resources and their conservation.", feedsInto: ["geography-of-india", "human-and-economic-geography"] },
        ],
      },
      {
        subject: "English",
        color: "rose",
        accent: "#E11D48",
        topics: [
          { name: "Vocabulary Building", summary: "Synonyms, antonyms and word usage.", feedsInto: ["vocabulary"] },
          { name: "Active and Passive Voice", summary: "Transforming sentences between voices.", feedsInto: ["grammar-and-sentence-correction"] },
        ],
      },
    ],
  },
  {
    classLevel: "9",
    label: "Class 9",
    subjects: [
      {
        subject: "Science",
        color: "emerald",
        accent: "#059669",
        topics: [
          { name: "Motion", summary: "Distance, displacement, speed, velocity and graphs.", feedsInto: ["modern-physics", "magnetism-and-emi"] },
          { name: "Atoms and Molecules", summary: "Laws of chemical combination, mole concept basics.", feedsInto: ["chemical-bonding-and-structure"] },
          { name: "The Fundamental Unit of Life", summary: "Cell organelles and their functions in depth.", feedsInto: ["cell-biology-and-genetics"] },
        ],
      },
      {
        subject: "Maths",
        color: "indigo",
        accent: "#6366F1",
        topics: [
          { name: "Polynomials", summary: "Degree, zeroes and factorisation of polynomials.", feedsInto: ["algebra"] },
          { name: "Coordinate Geometry", summary: "Cartesian plane and plotting points.", feedsInto: ["coordinate-geometry-and-vectors"] },
          { name: "Probability (Intro)", summary: "Experimental probability of simple events.", feedsInto: ["probability-and-statistics"] },
        ],
      },
      {
        subject: "Social Science",
        color: "orange",
        accent: "#EA580C",
        topics: [
          { name: "The French Revolution", summary: "Causes and impact of the French Revolution.", feedsInto: ["international-relations-and-contemporary-world"] },
          { name: "What is Democracy", summary: "Features and importance of democracy.", feedsInto: ["political-theory", "indian-constitution-and-politics"] },
        ],
      },
      {
        subject: "English",
        color: "rose",
        accent: "#E11D48",
        topics: [
          { name: "Reading Comprehension (Unseen)", summary: "Inference and vocabulary in unseen passages.", feedsInto: ["reading-comprehension"] },
          { name: "Sentence Rearrangement", summary: "Ordering jumbled sentences logically.", feedsInto: ["verbal-ability"] },
        ],
      },
    ],
  },
  {
    classLevel: "10",
    label: "Class 10",
    subjects: [
      {
        subject: "Science",
        color: "emerald",
        accent: "#059669",
        topics: [
          { name: "Chemical Reactions and Equations", summary: "Types of reactions and balancing equations.", feedsInto: ["equilibrium-and-thermodynamics", "electrochemistry-and-kinetics"] },
          { name: "Light — Reflection and Refraction", summary: "Mirrors, lenses and ray diagrams.", feedsInto: ["optics"] },
          { name: "Life Processes", summary: "Nutrition, respiration, transport and excretion.", feedsInto: ["human-physiology", "plant-physiology"] },
        ],
      },
      {
        subject: "Maths",
        color: "indigo",
        accent: "#6366F1",
        topics: [
          { name: "Quadratic Equations", summary: "Roots, discriminant and applications.", feedsInto: ["algebra"] },
          { name: "Trigonometry (Intro)", summary: "Trigonometric ratios and identities.", feedsInto: ["relations-functions-and-trigonometry"] },
          { name: "Statistics", summary: "Mean, median and mode of grouped data.", feedsInto: ["probability-and-statistics", "statistics-and-development-issues"] },
        ],
      },
      {
        subject: "Social Science",
        color: "orange",
        accent: "#EA580C",
        topics: [
          { name: "Nationalism in India", summary: "The freedom movement and its phases.", feedsInto: ["modern-india-and-freedom-struggle"] },
          { name: "Development (Economics)", summary: "Income, growth and human development.", feedsInto: ["indian-economic-development", "microeconomics"] },
        ],
      },
      {
        subject: "English",
        color: "rose",
        accent: "#E11D48",
        topics: [
          { name: "Advanced Comprehension", summary: "Tone, purpose and inference at exam level.", feedsInto: ["reading-comprehension"] },
          { name: "Editing and Error Correction", summary: "Spotting and fixing grammatical errors.", feedsInto: ["grammar-and-sentence-correction"] },
        ],
      },
    ],
  },
];

export function getFoundationClass(classLevel: string): FoundationClass | undefined {
  return foundationClasses.find((c) => c.classLevel === classLevel);
}

export function getFoundationSubject(
  classLevel: string,
  subject: string
): FoundationSubjectBlock | undefined {
  const cls = getFoundationClass(classLevel);
  return cls?.subjects.find((s) => s.subject.toLowerCase() === subject.toLowerCase());
}
