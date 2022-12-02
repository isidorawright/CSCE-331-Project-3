export interface IExcess {
    id: number;
    productName: string;
    count: number;
  
    selected?: boolean;
  }

  export function Excess(excess?: IExcess): IExcess {
    if (excess) {
      return excess;
    }
    return {
      id: -1,
      productName: " ",
      count: -1,
    } as IExcess;
  }