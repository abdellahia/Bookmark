import { Component, AfterViewInit } from '@angular/core';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent {
  public faUserShield = faUserShield;
  constructor() { }




}
