import { Tweet } from "./tweet.model";

export class Usuario {
  constructor(
    private _id: string,
    private _nome: string,
    private _usuario: string,
    private _email: string,
    private _senha: string,
    private _tweets?: Tweet[]
  ) {}

  public get id(): string {
    return this._id;
  }

  public get nome(): string {
    return this._nome;
  }

  public get usuario(): string {
    return this._usuario;
  }

  public get email(): string {
    return this._email;
  }

  public get senha(): string {
    return this._senha;
  }

  public get tweets(): Tweet[] | undefined {
    return this._tweets;
  }

  public toJSON() {
    return {
      id: this._id,
      nome: this._nome,
      email: this._email,
      usuario: this._usuario,
      tweets: this._tweets,
    };
  }
}
