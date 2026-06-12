"use client";

import { useState, useEffect } from "react";


export function TestimonialPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Check if user has already given testimonial
    const alreadyGiven = localStorage.getItem("testimonial_given");
    if (alreadyGiven) return;

    // Check quiz count
    const quizCountStr = localStorage.getItem("quiz_count");
    const quizCount = quizCountStr ? parseInt(quizCountStr, 10) : 0;

    if (quizCount >= 10) {
      setIsOpen(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get quiz count from localStorage
      const quizCountStr = localStorage.getItem("quiz_count") || "0";
      const quizCount = parseInt(quizCountStr, 10);

      // POST to API
      const response = await fetch("/api/testimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          text: text.trim() || null,
          stars,
          quizCount,
        }),
      });

      if (response.ok) {
        localStorage.setItem("testimonial_given", "true");
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          setName("");
          setText("");
          setStars(5);
        }, 2000);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert("Error submitting testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          disabled={isSubmitting}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <span className="text-xl leading-none">×</span>
        </button>

        {submitted ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Thank you!</h2>
            <p className="text-sm text-gray-600">
              Your feedback helps us serve students like you better.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">
                You've completed 10 sessions!
              </h2>
              <p className="text-sm text-gray-600">
                How is 10minCUET helping you?
              </p>
            </div>

            <div className="space-y-5">
              {/* Star rating */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Rate your experience
                </label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStars(s)}
                      disabled={isSubmitting}
                      className={`text-3xl transition-transform disabled:opacity-50 ${
                        s <= stars ? "scale-110" : "opacity-40 hover:opacity-60"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Name field */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Your name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul, Jaipur"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full mt-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                />
              </div>

              {/* Feedback text */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Your feedback (optional)
                </label>
                <textarea
                  placeholder="Tell us what you love about 10minCUET..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full mt-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none disabled:opacity-50"
                />
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !name.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-orange-100 disabled:shadow-none"
              >
                {isSubmitting ? "Submitting..." : "Share Your Feedback"}
              </button>

              {/* Skip option */}
              <button
                onClick={() => {
                  localStorage.setItem("testimonial_given", "true");
                  setIsOpen(false);
                }}
                disabled={isSubmitting}
                className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 disabled:opacity-50"
              >
                Maybe later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
