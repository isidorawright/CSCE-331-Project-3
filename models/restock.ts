export interface IRestock {
    restockName: string;
    amount: string;
  
    selected?: boolean;
  }

  export function Restock(restock?: IRestock): IRestock {
    if (restock) {
      return restock;
    }
    return {
      restockName: "",
      amount: "",

    } as IRestock;
  }