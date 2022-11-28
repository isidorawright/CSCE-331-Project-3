export class Some<T> {
  constructor(public value: T) {}
  map<U>(f: (t: T) => U): Some<U> {
    return new Some(f(this.value));
  }
  flatMap<U>(f: (t: T) => Some<U>): Some<U> {
    return f(this.value);
  }
}

export class None {
  constructor(public value: undefined = undefined) {}
  map<U>(f: (t: undefined) => U): None {
    return new None();
  }
  flatMap<T>(f: (t: any) => Option<T>): None {
    return new None();
  }
}

export type Option<T> = Some<T> | None;
