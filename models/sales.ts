export interface ISales {
    itemName: string;
    itemSale: string;
  
    selected?: boolean;
  }
 /**
   * Returns the data needed for the sales table
   * @return item name. This is the name of the menu item
   * @return item sale. This is is amount of money that the menu item has made.
   * @param sale
   */
  export function Sale(sale?: ISales): ISales {
    if (sale) {
      return sale;
    }
    return {
      itemName: "",
      itemSale: "",
    } as ISales;
  }