export interface Data {
  data: Data;
  success: boolean;
}

export interface Data {
  firstHalf: FirstHalf[];
  secondHalf: SecondHalf[];
  fullMatch: FullMatch[];
}

export interface FirstHalf {
  score: string;
  probability: string;
}

export interface SecondHalf {
  score: string;
  probability: string;
}

export interface FullMatch {
  score: string;
  probability: string;
}
