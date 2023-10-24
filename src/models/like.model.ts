export class Like {
  constructor(private _id: string) {}

  public get id(): string {
    return this._id;
  }

  public toJSON() {
    return {
      id: this._id,
    };
  }
}
