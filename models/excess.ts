export interface IExcess {
    // id: number;
    productName: string;
    percentSold: string;
  
    selected?: boolean;
  }

  export function Excess(excess?: IExcess): IExcess {
    if (excess) {
      return excess;
    }
    return {
      //id: -1,
      productName: " ",
      percentSold: "",
    } as IExcess;
  }