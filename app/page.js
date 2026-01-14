"use client";
import { useState } from "react";
import { CheckCircle, XCircle, User, Heart, Users, Smartphone } from "lucide-react";

const questions = [
  "I often notice small sounds when others do not.",
  "I usually concentrate more on the whole picture, rather than the small details.",
  "I find it easy to 'read between the lines' when someone is talking to me.",
  "I know how to tell if someone listening to me is getting bored.",
  "When I'm reading a story, I find it difficult to work out the characters' intentions.",
  "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
  "New situations make me anxious.",
  "I enjoy social occasions.",
  "I find myself drawn more strongly to people than to things.",
  "I find it hard to make new friends."
];

export default function Home() {
  const [answers, setAnswers] = useState(Array(10).fill(null)); // null, true (yes), false (no)
  const [personalInfo, setPersonalInfo] = useState({
    gender: null, // true male, false female
    jaundice: null,
    familyAutism: null,
    usedAppBefore: null
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handlePersonalChange = (key, value) => {
    setPersonalInfo({ ...personalInfo, [key]: value });
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const progress = (answeredCount / 10) * 100;

  const handleSubmit = async () => {
    if (answeredCount < 10 || Object.values(personalInfo).some(v => v === null)) {
      alert("Please answer all questions and provide personal information.");
      return;
    }
    setLoading(true);

    const answersStrings = answers.map(a => a ? "Yes" : "No");

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersStrings, personalInfo })
      });
      const data = await res.json();
      if (res.ok) {
        setPrediction(data.prediction);
      } else {
        alert(data.message || "Error generating analysis.");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-slate-50 py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6">
            Autism Spectrum Disorder (ASD) Prediction
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed">
            ASD is a developmental condition that affects how people perceive the world and interact with others.
            Early screening can provide timely support and improve outcomes. This tool helps raise awareness
            through a simple questionnaire.
          </p>
        </div>
      </section>

      {/* Questionnaire Section */}
      <section className="py-8 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-indigo-600">AQ-10 Screening Questionnaire</h2>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Progress</span>
              <span>{answeredCount}/10 questions answered</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Questions Cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {questions.map((question, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-slate-200 h-full flex flex-col">
                <h3 className="text-base sm:text-lg font-medium mb-4 text-slate-800 flex-grow">A{index + 1}: {question}</h3>
                <div className="flex gap-2 sm:gap-4 mt-auto">
                  <button
                    onClick={() => handleAnswerChange(index, true)}
                    className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      answers[index] === true
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle className="inline mr-1 sm:mr-2" size={18} />
                    Yes
                  </button>
                  <button
                    onClick={() => handleAnswerChange(index, false)}
                    className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      answers[index] === false
                        ? 'bg-red-100 text-red-800 border-2 border-red-500'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <XCircle className="inline mr-1 sm:mr-2" size={18} />
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Information Section */}
      <section className="py-8 sm:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8 text-indigo-600">Personal Information</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {/* Gender */}
            <div className="bg-slate-50 rounded-lg p-4 sm:p-6 border border-slate-200 h-full flex flex-col">
              <div className="flex items-center mb-4 flex-grow">
                <User className="mr-2 text-indigo-600" size={20} />
                <h3 className="text-base sm:text-lg font-medium text-slate-800">Gender</h3>
              </div>
              <div className="flex gap-2 sm:gap-4 mt-auto">
                <button
                  onClick={() => handlePersonalChange('gender', true)}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    personalInfo.gender === true
                      ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => handlePersonalChange('gender', false)}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    personalInfo.gender === false
                      ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-500'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Jaundice at Birth */}
            <div className="bg-slate-50 rounded-lg p-4 sm:p-6 border border-slate-200 h-full flex flex-col">
              <div className="flex items-center mb-4 flex-grow">
                <Heart className="mr-2 text-indigo-600" size={20} />
                <h3 className="text-base sm:text-lg font-medium text-slate-800">Jaundice at Birth</h3>
              </div>
              <div className="flex gap-2 sm:gap-4 mt-auto">
                <button
                  onClick={() => handlePersonalChange('jaundice', true)}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    personalInfo.jaundice === true
                      ? 'bg-green-100 text-green-800 border-2 border-green-500'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle className="inline mr-1 sm:mr-2" size={18} />
                  Yes
                </button>
                <button
                  onClick={() => handlePersonalChange('jaundice', false)}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    personalInfo.jaundice === false
                      ? 'bg-red-100 text-red-800 border-2 border-red-500'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <XCircle className="inline mr-1 sm:mr-2" size={18} />
                  No
                </button>
              </div>
            </div>

            {/* Family Autism History */}
            <div className="bg-slate-50 rounded-lg p-4 sm:p-6 border border-slate-200 h-full flex flex-col">
              <div className="flex items-center mb-4 flex-grow">
                <Users className="mr-2 text-indigo-600" size={20} />
                <h3 className="text-base sm:text-lg font-medium text-slate-800">Family Autism History</h3>
              </div>
              <div className="flex gap-2 sm:gap-4 mt-auto">
                <button
                  onClick={() => handlePersonalChange('familyAutism', true)}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    personalInfo.familyAutism === true
                      ? 'bg-green-100 text-green-800 border-2 border-green-500'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle className="inline mr-1 sm:mr-2" size={18} />
                  Yes
                </button>
                <button
                  onClick={() => handlePersonalChange('familyAutism', false)}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    personalInfo.familyAutism === false
                      ? 'bg-red-100 text-red-800 border-2 border-red-500'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <XCircle className="inline mr-1 sm:mr-2" size={18} />
                  No
                </button>
              </div>
            </div>

            {/* Previous App Usage */}
            <div className="bg-slate-50 rounded-lg p-4 sm:p-6 border border-slate-200 h-full flex flex-col">
              <div className="flex items-center mb-4 flex-grow">
                <Smartphone className="mr-2 text-indigo-600" size={20} />
                <h3 className="text-base sm:text-lg font-medium text-slate-800">Previous App Usage</h3>
              </div>
              <div className="flex gap-2 sm:gap-4 mt-auto">
                <button
                  onClick={() => handlePersonalChange('usedAppBefore', true)}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    personalInfo.usedAppBefore === true
                      ? 'bg-green-100 text-green-800 border-2 border-green-500'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle className="inline mr-1 sm:mr-2" size={18} />
                  Yes
                </button>
                <button
                  onClick={() => handlePersonalChange('usedAppBefore', false)}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    personalInfo.usedAppBefore === false
                      ? 'bg-red-100 text-red-800 border-2 border-red-500'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <XCircle className="inline mr-1 sm:mr-2" size={18} />
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-16 px-4 bg-slate-50">
        <div className="max-w-2xl mx-auto text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? "Generating Analysis..." : "Generate Analysis"}
          </button>
          {prediction && (
            <div className="mt-8 p-4 sm:p-6 bg-white rounded-lg shadow-md border border-slate-200">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-indigo-600">Analysis Result</h3>
              <p className="text-base sm:text-lg">{prediction}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 bg-slate-800 text-slate-300 text-center">
        <p className="text-sm sm:text-base">
          This tool is for screening awareness only and is not a medical diagnosis.
          Please consult with a healthcare professional for any concerns.
        </p>
      </footer>
    </div>
  );
}
