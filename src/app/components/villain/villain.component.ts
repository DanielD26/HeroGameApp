import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Villain } from 'src/app/models/villain';

@Component({
  selector: 'app-villain',
  templateUrl: './villain.component.html',
  styleUrls: ['./villain.component.css']
})
export class VillainComponent implements OnInit {
  @Input() villain: Villain;

  constructor(private _api: ApiService) { }

  ngOnInit(): void {
  }

}
