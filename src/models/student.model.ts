import { randomUUID } from "crypto";

export class Student {
  private _id: string;
  constructor(
    private _name: string,
    private _email: string,
    private _password: string,
    private _age?: number
  ) {
    this._id = randomUUID();
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get age(): number | undefined {
    return this._age;
  }
}
