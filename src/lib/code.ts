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
        probability: combinedProbability,
      });
    }
  }

  // Sort the scores by the most likely outcomes
  scoreProbabilities.sort((a, b) => b.probability - a.probability);

  return scoreProbabilities;
};

// Function to print probabilities
const printScoreProbabilities = (title: string, scoreProbabilities: any[]) => {
  console.log(`\nPredicted scores for the ${title}:`);
  scoreProbabilities.forEach(({ score, probability }) => {
    console.log(
      `Score: ${score}, Probability: ${(probability * 100).toFixed(2)}%`
    );
  });
};

// Function to fetch xG values from API and calculate probabilities
const calculateFromAPI = async (xgTeam1: number, xgTeam2: number) => {
  // Assumption: Split xG 50/50 between first and second halves
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
  const scoreProbabilitiesFull = calculateScoreProbabilities(xgTeam1, xgTeam2);

  // Print score probabilities for the first half
  printScoreProbabilities("first half", scoreProbabilitiesFirstHalf);

  // Print score probabilities for the second half
  printScoreProbabilities("second half", scoreProbabilitiesSecondHalf);

  // Print score probabilities for the full match
  printScoreProbabilities("full match", scoreProbabilitiesFull);
};

// Example API call (or pass these values from your API)
const fetchXGValues = async () => {
  try {
    // Simulate fetching from an API
    const xgTeam1 = 1.77; // You can replace this with an actual API call
    const xgTeam2 = 1.3;

    // Call the function to calculate based on API values
    await calculateFromAPI(xgTeam1, xgTeam2);
  } catch (error) {
    console.error("Error fetching xG values:", error);
  }
};

// Call this function to start the calculation
fetchXGValues();
