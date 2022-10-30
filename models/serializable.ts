export abstract class Serializable {
  // subclass should implement this
  constructor(data?: object) {
    if (data) {
      this.fromJson(data);
    }
  }
  public abstract fromJson(json: object): this;
  public static fromJson<T extends Serializable>(
    this: new () => T,
    json: object
  ): T {
    if (typeof json === "string") {
      try {
        json = JSON.parse(json);
      } catch (e) {
        return new this();
      }
    }
    return new this().fromJson(json);
  }
  // subclass can override
  public toJson(): string {
    return JSON.stringify(this);
  }
}
