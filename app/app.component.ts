import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'bookmark';
  userDetails: KeycloakProfile;

  constructor(private keycloakService: KeycloakService,
  ) {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
    }
  }
}
