import { mutation } from "./_generated/server";
import { v } from "convex/values";

const blogs = [
  {
    slug: "jee-main-physics-tips",
    title: "JEE Main Physics: Top 10 Tips to Score 80+",
    content: "<h1>JEE Main Physics: Scoring Strategy</h1><p>Physics requires deep conceptual understanding. Here are proven strategies to maximize your score in JEE Main.</p><h2>1. Focus on High-Weightage Topics</h2><p>Mechanics (30%), Electricity (20%), Modern Physics (15%) account for 65% of marks.</p><h2>2. Master Numerical Problems</h2><p>JEE loves calculations. Practice 100+ problems per chapter to develop speed.</p><h2>3. Use Conceptual Diagrams</h2><p>Draw free body diagrams for every mechanics problem. Visual understanding prevents silly mistakes.</p><h2>4. Time Management in Exam</h2><p>Allocate 1.5 min per question. Skip if stuck, come back later.</p><h2>5. Practice Previous Year Papers</h2><p>Last 5 years' papers reveal question patterns. Solve them under exam conditions.</p>",
    ncertBook: "Physics Part 1",
    ncertChapter: "Chapter 1: Units and Measurement",
    targetClasses: ["11", "12"],
    sequenceIn11th: 1,
    sequenceIn12th: 1,
  },
  {
    slug: "chemistry-organic-reactions",
    title: "Organic Chemistry: Master Reaction Mechanisms",
    content: "<h1>Organic Chemistry Reactions</h1><p>Organic chemistry is pattern recognition. Master these 30 reaction types and you'll solve 80% of problems.</p><h2>SN1 vs SN2 Reactions</h2><p>SN2: Bimolecular, inversion, 2° carbons. SN1: Unimolecular, racemization, 3° carbons.</p><h2>Elimination Reactions</h2><p>E1: 3° substrates, heat, polar solvent. E2: 2° substrates, strong base, anti-periplanar.</p>",
    ncertBook: "Chemistry Part 2",
    ncertChapter: "Chapter 5: Hydrocarbons",
    targetClasses: ["12"],
    sequenceIn12th: 5,
  },
  {
    slug: "mathematics-calculus-integration",
    title: "Calculus Integration: From Basics to Advanced",
    content: "<h1>Integration Techniques</h1><p>Integration is the reverse of differentiation. Master these 5 techniques and tackle any integral.</p><h2>Substitution Method</h2><p>Identify the derivative hidden in the integrand. Replace with u.</p><h2>Integration by Parts</h2><p>Use ILATE rule: Inverse trig, Logarithm, Algebraic, Trigonometric, Exponential.</p>",
    ncertBook: "Mathematics Part 2",
    ncertChapter: "Chapter 7: Integrals",
    targetClasses: ["12"],
    sequenceIn12th: 7,
  },
  {
    slug: "electrochemistry-redox-reactions",
    title: "Electrochemistry: Redox Reactions & Electrolysis",
    content: "<h1>Electrochemistry Fundamentals</h1><p>Electrochemistry combines chemistry and electricity. Redox and electrolysis are core concepts.</p><h2>Balancing Redox Reactions</h2><p>Step 1: Identify oxidation states. Step 2: Balance atoms. Step 3: Balance electrons.</p>",
    ncertBook: "Chemistry Part 1",
    ncertChapter: "Chapter 8: Redox Reactions",
    targetClasses: ["11"],
    sequenceIn11th: 8,
  },
  {
    slug: "thermodynamics-heat-work",
    title: "Thermodynamics: Heat, Work & Energy",
    content: "<h1>First Law of Thermodynamics</h1><p>ΔU = q + w. Internal energy change equals heat absorbed plus work done on system.</p><h2>Entropy & Spontaneity</h2><p>ΔG = ΔH - TΔS. Negative ΔG means spontaneous reaction.</p>",
    ncertBook: "Chemistry Part 1",
    ncertChapter: "Chapter 6: Thermodynamics",
    targetClasses: ["11"],
    sequenceIn11th: 6,
  },
  {
    slug: "waves-oscillations",
    title: "Waves & Oscillations: Complete Guide",
    content: "<h1>Simple Harmonic Motion</h1><p>Periodic motion where force is proportional to displacement: F = -kx.</p><h2>Wave Equation</h2><p>v = fλ. Velocity = frequency × wavelength.</p>",
    ncertBook: "Physics Part 1",
    ncertChapter: "Chapter 14: Oscillations",
    targetClasses: ["11"],
    sequenceIn11th: 14,
  },
  {
    slug: "genetics-inheritance-patterns",
    title: "Genetics: Mendel's Laws & Inheritance",
    content: "<h1>Mendelian Inheritance</h1><p>Gregor Mendel's three laws explain heredity patterns.</p><h2>Law of Segregation</h2><p>Alleles separate during gamete formation. Each gamete gets one allele.</p>",
    ncertBook: "Biology Part 2",
    ncertChapter: "Chapter 5: Principles of Inheritance",
    targetClasses: ["12"],
    sequenceIn12th: 5,
  },
  {
    slug: "atomic-structure-electrons",
    title: "Atomic Structure: Electrons, Orbitals & Quantum Numbers",
    content: "<h1>Bohr Model & Quantum Model</h1><p>Bohr model: electrons orbit nucleus at fixed energy levels. Quantum model: electrons in probabilistic orbitals.</p><h2>Quantum Numbers</h2><p>n (principal), l (angular), ml (magnetic), ms (spin) define electron position.</p>",
    ncertBook: "Chemistry Part 1",
    ncertChapter: "Chapter 2: Structure of Atom",
    targetClasses: ["11"],
    sequenceIn11th: 2,
  },
  {
    slug: "vectors-projectile-motion",
    title: "Vectors & Projectile Motion: Applications",
    content: "<h1>Vector Addition</h1><p>Parallelogram law and triangle law for vector addition.</p><h2>Projectile Motion</h2><p>Max height: H = u²sin²θ/2g. Range: R = u²sin2θ/g.</p>",
    ncertBook: "Physics Part 1",
    ncertChapter: "Chapter 3: Motion in a Plane",
    targetClasses: ["11"],
    sequenceIn11th: 3,
  },
];

// Generate 40 more blogs quickly
for (let i = 11; i <= 50; i++) {
  const subjects = ["Physics", "Chemistry", "Biology", "Mathematics"] as const;
  const subject = subjects[i % 4];
  const topics: Record<typeof subject, string[]> = {
    Physics: ["Mechanics", "Optics", "Thermodynamics", "Electromagnetism", "Modern Physics"],
    Chemistry: ["Organic", "Inorganic", "Physical", "Analytical", "Biochemistry"],
    Biology: ["Botany", "Zoology", "Ecology", "Genetics", "Physiology"],
    Mathematics: ["Algebra", "Geometry", "Calculus", "Trigonometry", "Statistics"],
  };
  const topic = topics[subject][i % 5];

  const blogData: any = {
    slug: `${subject.toLowerCase()}-${topic.toLowerCase()}-${i}`.replace(/\s+/g, "-"),
    title: `${subject} ${topic}: Topic ${i}`,
    content: `<h1>${subject} ${topic}</h1><p>This is a comprehensive guide to ${subject} ${topic} for JEE and NEET exam preparation.</p><h2>Key Concepts</h2><p>Master the fundamental concepts to excel in this topic.</p><h2>Practice Problems</h2><p>Solve at least 50 problems to build confidence and speed.</p><h2>Tips & Tricks</h2><p>Use mnemonics and shortcuts to remember formulas and reactions.</p>`,
    ncertBook: `${subject} Part ${(i % 2) + 1}`,
    ncertChapter: `Chapter ${(i % 15) + 1}: ${topic}`,
    targetClasses: i % 2 === 0 ? ["11"] : ["12"],
  };

  if (i % 2 === 0) {
    blogData.sequenceIn11th = i;
  } else {
    blogData.sequenceIn12th = i;
  }

  blogs.push(blogData);
}

const _seedBlogs = mutation(async (ctx) => {
  let count = 0;

  for (const blog of blogs) {
    try {
      await ctx.db.insert("blogs", {
        slug: blog.slug,
        title: blog.title,
        content: blog.content,
        ncertBook: blog.ncertBook,
        ncertChapter: blog.ncertChapter,
        targetClasses: blog.targetClasses as any,
        sequenceIn11th: blog.sequenceIn11th,
        sequenceIn12th: blog.sequenceIn12th,
        richContent: blog.content,
        ncertPdfUrl: `https://ncert.nic.in/textbook/${blog.ncertBook.replace(/\s+/g, "-").toLowerCase()}.pdf`,
        estimatedStudyTime: 30 + Math.random() * 60,
        createdAt: Date.now(),
      });
      count++;
    } catch (error) {
      console.error(`Failed to insert blog ${blog.slug}:`, error);
    }
  }

  return {
    success: true,
    message: `Seeded ${count} blogs to 10minJEE database`,
    blogs_inserted: count,
  };
});

export const seedBlogs = _seedBlogs as any;
