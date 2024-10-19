import { NextRequest, NextResponse } from "next/server";

// Helper function to calculate factorial
const factorial = (n: number): number => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// Poisson distribution function to calculate goal probabilities
const poisson = (xg: number, k: number): number => {
  if (isNaN(xg) || isNaN(k) || xg < 0 || k < 0) return 0; // Ensure valid inputs
  return (Math.pow(xg, k) * Math.exp(-xg)) / factorial(k);
};

// Function to calculate score probabilities
const calculateScoreProbabilities = (
  xgTeam1: number,
  xgTeam2: number,
  maxGoals = 5
) => {
  let scoreProbabilities = [];

  for (let goalsTeam1 = 0; goalsTeam1 <= maxGoals; goalsTeam1++) {
    for (let goalsTeam2 = 0; goalsTeam2 <= maxGoals; goalsTeam2++) {
      const probTeam1 = poisson(xgTeam1, goalsTeam1);
      const probTeam2 = poisson(xgTeam2, goalsTeam2);

      const combinedProbability = probTeam1 * probTeam2;

      // Handle potential NaN values and convert probabilities to percentages
      scoreProbabilities.push({
        score: `${goalsTeam1}-${goalsTeam2}`,
        probability: isNaN(combinedProbability)
          ? "0.00"
          : (combinedProbability * 100).toFixed(2), // Convert to percentage
      });
    }
  }

  // Sort the scores by the most likely outcomes
  scoreProbabilities.sort(
    (a, b) => parseFloat(b.probability) - parseFloat(a.probability)
  );

  return scoreProbabilities;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const xg1 = searchParams.get("xg1");
  const xg2 = searchParams.get("xg2");

  // Add CORS headers to the response
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight request
  if (request.method === "OPTIONS") {
    return NextResponse.json(null, { headers: corsHeaders });
  }

  if (!xg1 || !xg2) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing xG values.",
      },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    // Convert xG values to numbers and validate
    const xgTeam1 = parseFloat(xg1);
    const xgTeam2 = parseFloat(xg2);

    if (isNaN(xgTeam1) || isNaN(xgTeam2)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid xG values.",
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Calculate xG values for each half (assumed to be split 50/50)
    const xgTeam1FirstHalf = xgTeam1 * 0.5;
    const xgTeam1SecondHalf = xgTeam1 * 0.5;
    const xgTeam2FirstHalf = xgTeam2 * 0.5;
    const xgTeam2SecondHalf = xgTeam2 * 0.5;

    // Calculate score probabilities for the first half
    const scoreProbabilitiesFirstHalf = calculateScoreProbabilities(
      xgTeam1FirstHalf,
      xgTeam2FirstHalf
    );

    // Calculate score probabilities for the second half
    const scoreProbabilitiesSecondHalf = calculateScoreProbabilities(
      xgTeam1SecondHalf,
      xgTeam2SecondHalf
    );

    // Calculate score probabilities for the full match
    const scoreProbabilitiesFull = calculateScoreProbabilities(
      xgTeam1,
      xgTeam2
    );

    return NextResponse.json(
      {
        data: {
          firstHalf: scoreProbabilitiesFirstHalf,
          secondHalf: scoreProbabilitiesSecondHalf,
          fullMatch: scoreProbabilitiesFull,
        },
        success: true,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
