interface ReadinessData {
  userId: string;
  score: number;
  topicCoverage: number;
  mockScoreAvg: number;
  attendanceRate: number;
  weakTopics: string[];
  recommendations: string[];
  calculatedAt: number | null;
}

interface ReadinessChartProps {
  userId: string;
}

function scoreColor(score: number): {
  text: string;
  bg: string;
  border: string;
  bar: string;
  label: string;
} {
  if (score >= 75) {
    return {
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      bar: "bg-green-500",
      label: "Strong",
    };
  }
  if (score >= 50) {
    return {
      text: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      bar: "bg-yellow-400",
      label: "Building",
    };
  }
  return {
    text: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    bar: "bg-red-500",
    label: "Needs Work",
  };
}

interface SubScoreBarProps {
  label: string;
  weight: string;
  value: number;
  barColor: string;
}

function SubScoreBar({ label, weight, value, barColor }: SubScoreBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{weight} weight</span>
          <span className="text-xs font-black text-gray-900">{pct.toFixed(0)}%</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export async function ReadinessChart({ userId }: ReadinessChartProps) {
  let data: ReadinessData | null = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/readiness/${userId}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      if (!json.error) {
        data = json as ReadinessData;
      }
    }
  } catch {
    // Network error — fall through to empty state
  }

  const hasData = data && (data.score > 0 || data.topicCoverage > 0 || data.mockScoreAvg > 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h2 className="font-black text-gray-900 text-lg mb-2">Your CUET Readiness</h2>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Complete quizzes and mocks to see your readiness score. Your personalised analysis will appear here.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {["Topic Coverage", "Mock Score Avg", "Attendance Rate"].map((label) => (
            <div key={label} className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-center border border-gray-100">
              <p className="text-2xl font-black text-gray-300">—</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const score = Math.min(100, Math.max(0, data!.score));
  const colors = scoreColor(score);
  const weakTopics = (data!.weakTopics ?? []).slice(0, 3);
  const recommendations = (data!.recommendations ?? []).slice(0, 3);

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden ${colors.border}`}>
      {/* Title bar */}
      <div className="bg-white px-5 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-gray-900 text-lg leading-tight">Your CUET Readiness</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Based on your quizzes, mocks, and study patterns
            </p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
            {colors.label}
          </span>
        </div>

        {/* Big score display */}
        <div className={`${colors.bg} rounded-2xl px-6 py-6 mb-5 flex items-center gap-6 border ${colors.border}`}>
          <div className="shrink-0 text-center">
            <p className={`text-6xl font-black leading-none ${colors.text}`}>{score.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1 font-semibold">out of 100</p>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Readiness gauge</p>
            <div className="h-3 bg-white/70 rounded-full overflow-hidden border border-white/50">
              <div
                className={`h-3 rounded-full transition-all ${
                  score >= 75
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : score >= 50
                    ? "bg-gradient-to-r from-yellow-300 to-yellow-500"
                    : "bg-gradient-to-r from-red-400 to-red-600"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-gray-400">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="bg-white px-5 pb-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Score Breakdown</p>
        <div className="space-y-4">
          <SubScoreBar
            label="Topic Coverage"
            weight="40%"
            value={data!.topicCoverage}
            barColor={scoreColor(data!.topicCoverage).bar}
          />
          <SubScoreBar
            label="Mock Score Avg"
            weight="40%"
            value={data!.mockScoreAvg}
            barColor={scoreColor(data!.mockScoreAvg).bar}
          />
          <SubScoreBar
            label="Attendance Rate"
            weight="20%"
            value={data!.attendanceRate}
            barColor={scoreColor(data!.attendanceRate).bar}
          />
        </div>
      </div>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <div className="bg-orange-50 border-t border-orange-100 px-5 py-4">
          <p className="text-xs font-bold text-orange-700 uppercase tracking-widest mb-2.5">
            Weak Topics to Focus On
          </p>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((topic) => (
              <span
                key={topic}
                className="text-xs font-semibold text-orange-700 border border-orange-300 bg-white px-3 py-1 rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white border-t border-gray-100 px-5 py-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
            Recommendations
          </p>
          <ul className="space-y-1.5">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-orange-400 font-black mt-0.5 shrink-0">›</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
