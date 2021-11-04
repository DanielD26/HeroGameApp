import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Game } from 'src/app/models/game';
import { Hero } from 'src/app/models/hero';
import { Villain } from 'src/app/models/villain';
import { Result } from 'src/app/models/result';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  heroList: Hero[];
  villainsList: Villain[];
  resultsList: Result[];
  game: Game = new Game();
  selectedHero: Hero;
  selectedVillain: Villain;
  clicked = false;
  totalUses: number;
  totalHP: number;
  chosenHeroVillain = true;
  postGame: Result;
  currentDate = new Date;


  currentSelectedHeroIndex: number;
  currentSelectedVillainIndex: number;
  constructor(private _api: ApiService) { }

  ngOnInit() {
    this._api.getAllHeroes().subscribe(
      unpackedHero => this.heroList = unpackedHero
    )
    this._api.getAllVillains().subscribe(
      unpackedVillain => this.villainsList = unpackedVillain
    )

    this._api.getResults().subscribe(
      unpackedResults => this.resultsList = unpackedResults
    )
  }

  loadGame(): void {
    for(let i=0; i < this.villainsList.length; i++) {
      this.villainsList[i].HP = Math.floor(Math.random() * (20 - 1) + 1)
    }
    console.log(this.resultsList.reverse())
  }

  setSelectedHero(event): void {

    // reset all app-hero class names to blank. Access parent of the current target and change all child elements
    for (let appHero of event.currentTarget.parentElement.children) {
      appHero.className = '';
    }

    // if the index of the selected hero is the same as the clicked hero, returns to null, unselecting the hero
    // and changing back the chosen property to false and disabling the roll button
    if (this.currentSelectedHeroIndex == event.currentTarget.id ) {
      this.currentSelectedHeroIndex = null;
      this.selectedHero.chosen = false;
      this.chosenHeroVillain = true;
      return;
    }

    // get the index of the selected hero
    this.currentSelectedHeroIndex = event.currentTarget.id;

    // set the class of the selected hero to apply some styling
    event.currentTarget.className = "selected";

    // get the id from the clicked hero to look up the hero object from the game array
    this.selectedHero = this.heroList[this.currentSelectedHeroIndex];

    // sets chosen property to true
    this.selectedHero.chosen = true;
    this.enableRoll();
  }

  setSelectedVillain(event): void {

    // reset all app-villain class names to blank. Access parent of the current target and change all child elements
    for(let appVillain of event.currentTarget.parentElement.children) {
      appVillain.className = "";
    }

    // if the index of the selected villain is the same as the clicked villain, returns selectedVillain to null, unselecting the villain
    // and changing back the chosen property to false and disabling the roll button
    if (this.currentSelectedVillainIndex == event.currentTarget.id) {
      this.currentSelectedVillainIndex = null;
      this.selectedVillain.chosen = false
      this.chosenHeroVillain = true;
      return;
    }

    // get the index of the selected villain
    this.currentSelectedVillainIndex = event.currentTarget.id;

    // set the class of the selected hero to apply some styling
    event.currentTarget.className = "selected";

    // get the id from the clicked villain to look up the villain object from the game array
    this.selectedVillain = this.villainsList[this.currentSelectedVillainIndex];

    // sets chosen property to true
    this.selectedVillain.chosen = true;
    this.enableRoll();
  }

  enableRoll(): void {
    // checks if both a hero and villain is chosen then enables the roll button
    if (this.selectedHero.chosen == true) {

      if (this.selectedVillain.chosen == true) {
        this.chosenHeroVillain = false;
      }
    } else {
      this.chosenHeroVillain = true;
    }
  }

  roll(): void {
    // generates the random roll using the hero's min and max rolls
    this.game.heroRoll = Math.floor(Math.random() * (this.selectedHero.maxDice  - this.selectedHero.minDice + 1) + this.selectedHero.minDice);
    // if the villan's hp is greater than 0, allow hero to attack, else run method disableVillan();
    if(this.selectedVillain.HP > 0) {
      // if the hero's uses is not = 0, minus one use, else run method disableHero();
      if(this.selectedHero.uses != 0) {
        this.selectedHero.uses--;
      } else {
        this.disableHero();
        return;
      }

      // minus the villains hp from the roll
      this.selectedVillain.HP -= this.game.heroRoll;

      // checks if the villain has hp less than 0 and if so, make the hp 0 to avoid a negative result and disable villain
      if(this.selectedVillain.HP <= 0) {
        this.selectedVillain.HP = 0
        console.log("disable villain")
      }
        this.results();
    }
  }

  disableHero(): void {
    console.log("hero disabled");
  }

  heroesWin(): void {
    this.postGame = {winner: "Heroes win", date: this.currentDate }

    this._api.postResults(this.postGame).subscribe(
      response => console.log("working", response)
    )
  }

  villainsWin(): void {
    this.postGame = {winner: "Villains win", date: this.currentDate }

    this._api.postResults(this.postGame).subscribe(
      response => console.log("working", response)
    )
  }

  results(): void {
    // calculates the total uses from all heroes
    const display: HTMLElement = document.getElementById("result-disp") as HTMLElement
    display.innerHTML = `${this.selectedHero.name} rolled ${this.game.heroRoll} and attacked ${this.selectedVillain.name}`

    this.totalUses = this.heroList.map(a => a.uses).reduce(function(a, b){
      return a+b;
    });

    // calculates the total HP of all villains
    this.totalHP = this.villainsList.map(a => a.HP).reduce(function(a, b){
      return a+b;
    });

    //result of the game
    if(this.totalUses == 0) {
      display.innerHTML = `Villains win`;
      console.log('Villains win')
      this.villainsWin();
    } else if(this.totalHP == 0) {
      display.innerHTML = `Heroes win`;
      console.log('Heroes win')
      this.heroesWin();
    }
  }
}
