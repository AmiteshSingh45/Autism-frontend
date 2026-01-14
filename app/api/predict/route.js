import { NextResponse } from 'next/server';

// POST /api/predict
export async function POST(request) {
  try {
    const { answers, personalInfo } = await request.json();

    // Basic validation
    if (!answers || answers.length !== 10 || !personalInfo) {
      return NextResponse.json({ message: 'Invalid input. Please provide all 10 answers and personal information.' }, { status: 400 });
    }

    // AQ-10 Scoring Logic
    // Score 1 point for "Yes" on questions 1, 7, 10.
    // The question indices are 0, 6, 9
    const score_for_yes = [0, 6, 9];
    
    // Score 1 point for "No" on questions 2, 3, 4, 5, 6, 8, 9.
    // The question indices are 1, 2, 3, 4, 5, 7, 8
    const score_for_no = [1, 2, 3, 4, 5, 7, 8];

    let score = 0;

    answers.forEach((answer, index) => {
      if (answer === 'Yes' && score_for_yes.includes(index)) {
        score++;
      }
      if (answer === 'No' && score_for_no.includes(index)) {
        score++;
      }
    });

    // Return the score and a simple analysis
    return NextResponse.json({
      score,
      personalInfo,
      analysis: score >= 5
        ? "Indicates a high number of autistic traits."
        : "Indicates a low number of autistic traits.",
    });

  } catch (error) {
    console.error("Error in prediction API:", error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}