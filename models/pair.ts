export interface IPair {
    pairName: string;
    pairFrequency: string;
  
    selected?: boolean;
  }

export function Pair(pair?: IPair): IPair {
    if (pair) {
      return pair;
    }
    return {
      pairName: "",
      pairFrequency: ""
    } as IPair;
}