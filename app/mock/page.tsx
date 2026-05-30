'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import cuetGeneralTestQuestions from '../data/questions-cuet';
import type { Question } from '../data/questions';

type SectionKey = 'Languages' | 'Domain' | 'GeneralTest';

interface Section {
  key: SectionKey;
  label: string;
  description: string;
  questions: Question[];
  color: string;
  bgColor: string;
}

const QUESTIONS_PER_SECTION = 50;
const MINUTES_PER_SECTION = 60;
const MARKS_CORRECT = 5;
const MARKS_WRONG = -1;

function buildSectionQuestions(base: Question[], n: number): Question[] {
  const repeated: Question[] = [];
  while (repeated.length < n) repeated.push(...base);
  return repeated.slice(0, n);
}

const SECTIONS: Section[] = [
  {
    key: 'Languages',
    label: 'Section I – Languages',
    description: 'English / Hindi Language Comprehension',
    questions: buildSectionQuestions(
      cuetGeneralTestQuestions.filter((q) => q.subConcept.includes('Comprehension') || q.subConcept.includes('Grammar') || q.subConcept.includes('Synonym') || q.subConcept.includes('Antonym') || q.subConcept.includes('Idiom') || q.subConcept.includes('One Word') || q.subConcept.includes('Error') || q.subConcept.includes('Active') || q.subConcept.includes('Direct')),
      QUESTIONS_PER_SECTION,
    ),
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    key: 'Domain',
    label: 'Section II – Domain Subject',
    description: 'Your chosen stream subject (General Knowledge used as proxy)',
    questions: buildSectionQuestions(
      cuetGeneralTestQuestions.filter((q) =>
        ['Indian Constitution', 'History of India', 'Indian Geography', 'Indian Economy', 'Education Policy', 'Arts and Culture', 'Sports', 'Books and Authors', 'International Organizations', 'Science and Technology'].includes(q.subConcept),
      ),
      QUESTIONS_PER_SECTION,
    ),
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    key: 'GeneralTest',
    label: 'Section III – General Test',
    description: 'Quantitative Aptitude · Logical Reasoning · GK · English',
    questions: buildSectionQuestions(cuetGeneralTestQuestions, QUESTIONS_PER_SECTION),
    color: 'text-brand-600',
    bgColor: 'bg-brand-50',
  },
];

type MockPhase = 'landing' | 'section' | 'review' | 'result';

interface Answer {
  selected: number | null;
  visited: boolean;
}

export default function MockPage() {
  const [phase, setPhase] = useState<MockPhase>('landing');
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<SectionKey, Answer[]>>({
    Languages: Array(QUESTIONS_PER_SECTION).fill({ selected: null, visited: false }),
    Domain: Array(QUESTIONS_PER_SECTION).fill({ selected: null, visited: false }),
    GeneralTest: Array(QUESTIONS_PER_SECTION).fill({ selected: null, visited: false }),
  });
  const [timeLeft, setTimeLeft] = useState(MINUTES_PER_SECTION * 60);
  const [sectionResults, setSectionResults] = useState<Record<SectionKey, { score: number; attempted: number } | null>>({
    Languages: null,
    Domain: null,
    GeneralTest: null,
  });

  const activeSection = SECTIONS[activeSectionIdx];

  const finishSection = useCallback(() => {
    const sectionAnswers = answers[activeSection.key];
    let score = 0;
    let attempted = 0;
    sectionAnswers.forEach((a, i) => {
      if (a.selected !== null) {
        attempted++;
        const q = activeSection.questions[i];
        score += a.selected === q.correct ? MARKS_CORRECT : MARKS_WRONG;
      }
    });
    setSectionResults((prev) => ({ ...prev, [activeSection.key]: { score, attempted } }));
    setPhase('review');
  }, [activeSection, answers]);

  useEffect(() => {
    if (phase !== 'section') return;
    if (timeLeft <= 0) { finishSection(); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, finishSection]);

  function startSection(idx: number) {
    setActiveSectionIdx(idx);
    setQuestionIdx(0);
    setTimeLeft(MINUTES_PER_SECTION * 60);
    setPhase('section');
  }

  function selectOption(optIdx: number) {
    const key = activeSection.key;
    setAnswers((prev) => {
      const updated = [...prev[key]];
      updated[questionIdx] = { selected: optIdx, visited: true };
      return { ...prev, [key]: updated };
    });
  }

  function markVisited() {
    const key = activeSection.key;
    setAnswers((prev) => {
      const updated = [...prev[key]];
      if (!updated[questionIdx].visited) {
        updated[questionIdx] = { ...updated[questionIdx], visited: true };
      }
      return { ...prev, [key]: updated };
    });
  }

  function goToQuestion(idx: number) {
    markVisited();
    setQuestionIdx(idx);
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const timerUrgent = timeLeft < 300;

  // ── Landing ──────────────────────────────────────────────────────────────────
  if (phase === 'landing') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
            <Link href="/" className="text-brand-600 font-bold text-lg">← 10minCUET</Link>
            <span className="text-gray-400 text-sm">/ CUET Full Mock Test</span>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              NTA CUET Pattern
            </div>
            <h1 className="text-4xl font-extrabold mb-3">CUET Full Mock Test</h1>
            <p className="text-gray-500 text-lg">
              3 sections · 50 questions each · 60 minutes each · +5/−1 marking
            </p>
          </div>

          {/* Marking scheme */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
            <h2 className="font-semibold mb-4 text-gray-800">CUET Marking Scheme</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">+5</div>
                <div className="text-xs text-gray-500 mt-1">Correct Answer</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-500">−1</div>
                <div className="text-xs text-gray-500 mt-1">Wrong Answer</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-400">0</div>
                <div className="text-xs text-gray-500 mt-1">Unattempted</div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4 mb-8">
            {SECTIONS.map((s, idx) => {
              const result = sectionResults[s.key];
              return (
                <div key={s.key} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{s.label}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{s.description}</div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>📝 {QUESTIONS_PER_SECTION} Questions</span>
                      <span>⏱ {MINUTES_PER_SECTION} Minutes</span>
                      <span>🎯 Max {QUESTIONS_PER_SECTION * MARKS_CORRECT} marks</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {result ? (
                      <div>
                        <div className="text-lg font-bold text-brand-600">{result.score} pts</div>
                        <div className="text-xs text-gray-400">{result.attempted}/{QUESTIONS_PER_SECTION} attempted</div>
                        <button
                          onClick={() => startSection(idx)}
                          className="mt-2 text-xs text-gray-400 underline"
                        >
                          Retake
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startSection(idx)}
                        className="bg-brand-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
                      >
                        Start →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total score if all done */}
          {Object.values(sectionResults).every(Boolean) && (
            <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-8 text-white text-center">
              <div className="text-sm font-medium text-brand-200 mb-2">CUET Mock Score</div>
              <div className="text-5xl font-extrabold mb-1">
                {Object.values(sectionResults).reduce((sum, r) => sum + (r?.score ?? 0), 0)}
              </div>
              <div className="text-brand-200 text-sm">out of {SECTIONS.length * QUESTIONS_PER_SECTION * MARKS_CORRECT}</div>
              <button
                onClick={() => {
                  setSectionResults({ Languages: null, Domain: null, GeneralTest: null });
                  setAnswers({
                    Languages: Array(QUESTIONS_PER_SECTION).fill({ selected: null, visited: false }),
                    Domain: Array(QUESTIONS_PER_SECTION).fill({ selected: null, visited: false }),
                    GeneralTest: Array(QUESTIONS_PER_SECTION).fill({ selected: null, visited: false }),
                  });
                }}
                className="mt-6 bg-white text-brand-600 font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors"
              >
                Retake Full Mock
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Section in progress ───────────────────────────────────────────────────────
  if (phase === 'section') {
    const q = activeSection.questions[questionIdx];
    const currentAnswer = answers[activeSection.key][questionIdx];

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div>
            <div className="font-semibold text-sm text-gray-800">{activeSection.label}</div>
            <div className="text-xs text-gray-400">Q {questionIdx + 1} of {QUESTIONS_PER_SECTION}</div>
          </div>
          <div className={`text-2xl font-mono font-bold ${timerUrgent ? 'text-red-500 animate-pulse' : 'text-brand-600'}`}>
            {mins}:{secs}
          </div>
          <button
            onClick={finishSection}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Submit Section
          </button>
        </header>

        <div className="flex flex-1 max-w-6xl mx-auto w-full px-4 py-6 gap-6">
          {/* Question */}
          <div className="flex-1">
            {/* Marking info */}
            <div className="flex gap-3 mb-4 text-xs">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">+{MARKS_CORRECT} correct</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">{MARKS_WRONG} wrong</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-4">
              <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{q.subConcept}</div>
              <p className="text-gray-900 text-lg leading-relaxed">{q.text}</p>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = currentAnswer.selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectOption(i)}
                    className={`w-full text-left rounded-xl border-2 px-5 py-4 text-sm transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-100 bg-white hover:border-brand-300 hover:bg-brand-50/30'
                    }`}
                  >
                    <span className="font-semibold mr-3 text-gray-400">{String.fromCharCode(65 + i)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                disabled={questionIdx === 0}
                onClick={() => goToQuestion(questionIdx - 1)}
                className="flex-1 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  selectOption(-1 as unknown as number);
                  markVisited();
                  if (currentAnswer.selected !== null) {
                    setAnswers((prev) => {
                      const updated = [...prev[activeSection.key]];
                      updated[questionIdx] = { selected: null, visited: true };
                      return { ...prev, [activeSection.key]: updated };
                    });
                  }
                }}
                className="border border-orange-200 rounded-xl px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors"
              >
                Clear
              </button>
              <button
                disabled={questionIdx === QUESTIONS_PER_SECTION - 1}
                onClick={() => goToQuestion(questionIdx + 1)}
                className="flex-1 bg-brand-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-brand-700 disabled:opacity-30 transition-colors"
              >
                Save & Next →
              </button>
            </div>
          </div>

          {/* Question palette */}
          <div className="w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm sticky top-24">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Question Palette</h3>
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {Array.from({ length: QUESTIONS_PER_SECTION }).map((_, i) => {
                  const ans = answers[activeSection.key][i];
                  let cls = 'bg-gray-100 text-gray-500';
                  if (i === questionIdx) cls = 'bg-brand-600 text-white';
                  else if (ans.selected !== null) cls = 'bg-green-500 text-white';
                  else if (ans.visited) cls = 'bg-orange-400 text-white';
                  return (
                    <button
                      key={i}
                      onClick={() => goToQuestion(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${cls}`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500 inline-block" />Answered</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-400 inline-block" />Visited</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-100 inline-block" />Not visited</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Review ────────────────────────────────────────────────────────────────────
  if (phase === 'review') {
    const result = sectionResults[activeSection.key]!;
    const sectionAnswers = answers[activeSection.key];

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-gray-800">{activeSection.label} – Review</span>
          <button
            onClick={() => setPhase('landing')}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="grid grid-cols-3 gap-4 mb-10 text-center">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-extrabold text-brand-600">{result.score}</div>
              <div className="text-xs text-gray-400 mt-1">Score</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-extrabold text-green-600">{result.attempted}</div>
              <div className="text-xs text-gray-400 mt-1">Attempted</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-extrabold text-gray-500">{QUESTIONS_PER_SECTION - result.attempted}</div>
              <div className="text-xs text-gray-400 mt-1">Unattempted</div>
            </div>
          </div>

          <div className="space-y-6">
            {activeSection.questions.map((q, i) => {
              const ans = sectionAnswers[i];
              const isCorrect = ans.selected === q.correct;
              const isWrong = ans.selected !== null && !isCorrect;
              return (
                <div key={q.id + i} className={`bg-white rounded-2xl border p-6 shadow-sm ${isCorrect ? 'border-green-200' : isWrong ? 'border-red-200' : 'border-gray-100'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs text-gray-400">Q{i + 1} · {q.subConcept}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-green-100 text-green-700' : isWrong ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                      {isCorrect ? `+${MARKS_CORRECT}` : isWrong ? `${MARKS_WRONG}` : '0'}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-3">{q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      let cls = 'border-gray-100 text-gray-600';
                      if (oi === q.correct) cls = 'border-green-300 bg-green-50 text-green-800 font-medium';
                      else if (oi === ans.selected) cls = 'border-red-300 bg-red-50 text-red-700';
                      return (
                        <div key={oi} className={`border rounded-lg px-4 py-2 text-sm ${cls}`}>
                          <span className="font-semibold mr-2 opacity-60">{String.fromCharCode(65 + oi)}.</span>{opt}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-800">
                    <span className="font-semibold">Explanation: </span>{q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
