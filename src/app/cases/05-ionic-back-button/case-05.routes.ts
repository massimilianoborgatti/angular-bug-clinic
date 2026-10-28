import { DOCUMENT } from '@angular/common';
import { inject, provideEnvironmentInitializer } from '@angular/core';
import { Routes } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular';
import { initialize } from '@ionic/core/components';
import { Case05 } from './case-05';

const ionicConfig = {
  mode: 'md' as const,
  animated: false,
  hardwareBackButton: true,
  experimentalCloseWatcher: false,
};

export const CASE_05_ROUTES: Routes = [
  {
    path: '',
    component: Case05,
    providers: [
      provideIonicAngular(ionicConfig),
      provideEnvironmentInitializer(() => {
        inject(DOCUMENT).documentElement.classList.add('ion-ce');
        initialize(ionicConfig);
      }),
    ],
  },
];
