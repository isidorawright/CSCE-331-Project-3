export interface IPair {
    pairName: string;
    pairFrequency: string;
  
    selected?: boolean;
  }
/**
 * Returns the data needed for the pair analytics table
 * @return pair name. This is two strings; the names of the two most frequently bought items.
 * @return pair frequency; how many times this pair has been bought
 * @param pair
 */
export function Pair(pair?: IPair): IPair {
    if (pair) {
      return pair;
    }
    return {
      pairName: "",
      pairFrequency: ""
    } as IPair;
}