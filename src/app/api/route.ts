import { prisma } from "@/lib/prisma";
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

      scoreProbabilities.push({
        score: `${goalsTeam1}-${goalsTeam2}`,
        probability: combinedProbability, // Keep probability in decimal
      });
    }
  }

  // Sort the scores by the most likely outcomes
  scoreProbabilities.sort((a, b) => b.probability - a.probability);

  return scoreProbabilities;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const xg1 = searchParams.get("xg1");
  const xg2 = searchParams.get("xg2");

  if (!code || !xg1 || !xg2) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing parameters",
      },
      { status: 400 }
    );
  }

  try {
    const auth = await prisma.user.findUnique({
      where: {
        code: code,
      },
    });

    if (!auth) {
      return NextResponse.json(
        {
          error: "Invalid code or user not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Convert xG values to numbers
    const xgTeam1 = Number(xg1);
    const xgTeam2 = Number(xg2);

    // Calculate xG values for each half (assumed to be split 50/50 for the first and second halves)
    const xgTeam1FirstHalf = xgTeam1 * 0.5;
    const xgTeam1SecondHalf = xgTeam1 * 0.5; // Adjusted to use the second half
    const xgTeam2FirstHalf = xgTeam2 * 0.5;
    const xgTeam2SecondHalf = xgTeam2 * 0.5; // Adjusted to use the second half

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

    console.log({
      firstHalf: scoreProbabilitiesFirstHalf,
      secondHalf: scoreProbabilitiesSecondHalf,
      fullMatch: scoreProbabilitiesFull,
    });

    return NextResponse.json(
      {
        data: {
          firstHalf: scoreProbabilitiesFirstHalf,
          secondHalf: scoreProbabilitiesSecondHalf,
          fullMatch: scoreProbabilitiesFull,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
