export interface IExcess {
    productName: string;
    percentSold: string;
  
    selected?: boolean;
  }

  /**
   * Returns the data needed for the excess table
   * @return product name
   * @return percent of item sold
   * @param excess
   */
  export function Excess(excess?: IExcess): IExcess {
    if (excess) {
      return excess;
    }
    return {
      productName: "",
      percentSold: "",
    } as IExcess;
  }