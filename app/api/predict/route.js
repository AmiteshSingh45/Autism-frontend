import { NextResponse } from 'next/server';

// POST /api/predict
export async function POST(request) {
  try {
    const { answers, personalInfo } = await request.json();

    // Basic validation
    if (!answers || answers.length !== 10 || !personalInfo) {
      return NextResponse.json({ message: 'Invalid input. Please provide all 10 answers and personal information.' }, { status: 400 });
    }

    // Convert answers to features array
    const features = [
      answers[0] === 'Yes' ? 1 : 0,
      answers[1] === 'Yes' ? 1 : 0,
      answers[2] === 'Yes' ? 1 : 0,
      answers[3] === 'Yes' ? 1 : 0,
      answers[4] === 'Yes' ? 1 : 0,
      answers[5] === 'Yes' ? 1 : 0,
      answers[6] === 'Yes' ? 1 : 0,
      answers[7] === 'Yes' ? 1 : 0,
      answers[8] === 'Yes' ? 1 : 0,
      answers[9] === 'Yes' ? 1 : 0,
      0, // age, default
      personalInfo.gender ? 0 : 1, // 0 male, 1 female
      0, // ethnicity, default
      personalInfo.jaundice ? 1 : 0,
      personalInfo.familyAutism ? 1 : 0,
      0, // country, default
      personalInfo.usedAppBefore ? 1 : 0,
      0, // result, default
      0 // relation, default
    ];

    // Call external ML model API
    const modelApiUrl = process.env.NEXT_PUBLIC_MODEL_API;
    if (!modelApiUrl) {
      return NextResponse.json({ message: 'Model API not configured.' }, { status: 500 });
    }

    const response = await fetch(`${modelApiUrl}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ features }),
    });

    if (!response.ok) {
      throw new Error(`Model API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Return the prediction from the ML model
    return NextResponse.json({
      prediction: data.prediction || data.result || "Analysis completed",
      score: data.score || null,
      personalInfo,
    });

  } catch (error) {
    console.error("Error in prediction API:", error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}