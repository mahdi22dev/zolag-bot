// Native function to calculate factorial
const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// Function to calculate Poisson probability
const poisson = (xg, k) => {
  return (Math.pow(xg, k) * Math.exp(-xg)) / factorial(k);
};

// Function to calculate score probabilities based on xG for both teams
const calculateScoreProbabilities = (xgTeam1, xgTeam2, maxGoals = 5) => {
  let scoreProbabilities = [];

  for (let goalsTeam1 = 0; goalsTeam1 <= maxGoals; goalsTeam1++) {
    for (let goalsTeam2 = 0; goalsTeam2 <= maxGoals; goalsTeam2++) {
      const probTeam1 = poisson(xgTeam1, goalsTeam1);
      const probTeam2 = poisson(xgTeam2, goalsTeam2);
      const combinedProbability = probTeam1 * probTeam2;

      scoreProbabilities.push({
        score: ${goalsTeam1}-${goalsTeam2},
        probability: combinedProbability,
      });
    }
  }

  // Sort the scores by the most likely outcomes
  scoreProbabilities.sort((a, b) => b.probability - a.probability);

  return scoreProbabilities;
};

// Function to pretty print probabilities
const printScoreProbabilities = (title, scoreProbabilities) => {
  console.log(\nPredicted scores for the ${title}:);
  scoreProbabilities.forEach(({ score, probability }) => {
    console.log(
      Score: ${score}, Probability: ${(probability * 100).toFixed(2)}%
    );
  });
};

// bdel hna ar9ame xg
const xgTeam1Full = 2; // Example full-game xG for Team 1 (home)
const xgTeam2Full = 1.2; // Example full-game xG for Team 2 (away)
// bdel hna ar9ame xg

// Assumption: Split xG 50/50 between first and second halves
const xgTeam1FirstHalf = xgTeam1Full * 0.5; // Team 1 first half xG
const xgTeam1SecondHalf = xgTeam1Full * 0.5; // Team 1 second half xG

const xgTeam2FirstHalf = xgTeam2Full * 0.5; // Team 2 first half xG
const xgTeam2SecondHalf = xgTeam2Full * 0.5; // Team 2 second half xG

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
  xgTeam1Full,
  xgTeam2Full
);

// Print score probabilities for the first half
printScoreProbabilities("first half", scoreProbabilitiesFirstHalf);

// Print score probabilities for the second half
printScoreProbabilities("second half", scoreProbabilitiesSecondHalf);

// Print score probabilities for the full match
printScoreProbabilities("full match", scoreProbabilitiesFull);