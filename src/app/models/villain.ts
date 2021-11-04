export class Villain {
  villainID: number;
  name: string;
  HP: number;
  chosen: boolean;

  constructor(_villainID: number, _name: string) {
    this.villainID = _villainID;
    this.name = _name;
    this.chosen = false;
    this.HP = 10;
  }
}
