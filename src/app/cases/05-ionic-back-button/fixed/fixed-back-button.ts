import { Component, ViewEncapsulation } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { BackButtonDemo } from '../shared/back-button-demo';

@Component({
  selector: 'clinic-fixed-back-button',
  imports: [IonModal],
  templateUrl: '../shared/back-button-demo.html',
  styleUrl: '../shared/back-button-demo.css',
  encapsulation: ViewEncapsulation.None,
})
export class FixedBackButton extends BackButtonDemo {
  constructor() {
    super(0);
  }
}
