export interface IRestock {
    restockName: string;
    amount: string;
  
    selected?: boolean;
  }
   /**
   * Returns the data needed for the restock table
   * @return restock name. The name of the product that needs more inventory
   * @return amount. The amount of inventory left of the product
   * @param restock
   */
  export function Restock(restock?: IRestock): IRestock {
    if (restock) {
      return restock;
    }
    return {
      restockName: "",
      amount: "",

    } as IRestock;
  }