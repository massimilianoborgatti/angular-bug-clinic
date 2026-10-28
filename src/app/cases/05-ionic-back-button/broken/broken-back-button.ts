import { Component, ViewEncapsulation } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { BackButtonDemo } from '../shared/back-button-demo';

@Component({
  selector: 'clinic-broken-back-button',
  imports: [IonModal],
  templateUrl: '../shared/back-button-demo.html',
  styleUrl: '../shared/back-button-demo.css',
  encapsulation: ViewEncapsulation.None,
})
export class BrokenBackButton extends BackButtonDemo {
  constructor() {
    super(101);
  }
}
