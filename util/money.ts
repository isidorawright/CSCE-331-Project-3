export function toMoneyString(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

export function fromMoneyString(
  amount: string,
  locale: string = "en-US"
): number {
  return parseFloat(amount.replace(new RegExp(`[^\\d.-]`, "g"), ""));
}

export class Money {
  amount: number;
  constructor(
    amount: number | string,
    public currency: string = "USD",
    public locale: string = "en-US"
  ) {
    if (typeof amount === "string") {
      this.amount = fromMoneyString(amount, locale);
    } else {
      this.amount = amount;
    }
  }
  static of(
    amount: number | string,
    currency: string = "USD",
    locale: string = "en-US"
  ): Money {
    return new Money(amount, currency, locale);
  }
  add(other: Money | number | string): Money {
    if (typeof other === "string") {
      other = fromMoneyString(other, this.locale);
    }
    if (typeof other === "number") {
      return new Money(this.amount + other, this.currency, this.locale);
    }
    if (other.currency !== this.currency) {
      throw new Error("Cannot add different currencies");
    }
    return new Money(this.amount + other.amount, this.currency, this.locale);
  }
  sub(other: Money | number | string): Money {
    if (typeof other === "string") {
      other = fromMoneyString(other, this.locale);
    }
    if (typeof other === "number") {
      return new Money(this.amount - other, this.currency, this.locale);
    }
    if (other.currency !== this.currency) {
      throw new Error("Cannot subtract different currencies");
    }
    return new Money(this.amount - other.amount, this.currency, this.locale);
  }
  mul(other: Money | number | string): Money {
    if (typeof other === "string") {
      other = fromMoneyString(other, this.locale);
    }
    if (typeof other === "number") {
      return new Money(this.amount * other, this.currency, this.locale);
    }
    if (other.currency !== this.currency) {
      throw new Error("Cannot multiply different currencies");
    }
    return new Money(this.amount * other.amount, this.currency, this.locale);
  }
  div(other: Money | number | string): Money {
    if (typeof other === "string") {
      other = fromMoneyString(other, this.locale);
    }
    if (typeof other === "number") {
      return new Money(this.amount / other, this.currency, this.locale);
    }
    if (other.currency !== this.currency) {
      throw new Error("Cannot divide different currencies");
    }
    return new Money(this.amount / other.amount, this.currency, this.locale);
  }
  toString(): string {
    return toMoneyString(this.amount, this.currency, this.locale);
  }
}
