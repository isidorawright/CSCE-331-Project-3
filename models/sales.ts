export interface ISales {
    itemName: string;
    itemSale: string;
  
    selected?: boolean;
  }

  export function Sale(sale?: ISales): ISales {
    if (sale) {
      return sale;
    }
    return {
      itemName: "",
      itemSale: "",
    } as ISales;
  }