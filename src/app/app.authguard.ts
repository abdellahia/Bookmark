import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular';
import { environment } from '../environments/environment';

@Injectable()
export class AppAuthGuard extends KeycloakAuthGuard {
  granted: boolean;

  constructor(protected router: Router, protected keycloakAngular: KeycloakService) {
    super(router, keycloakAngular);
    this.granted = false;
  }

  get() {
    return this.roles;
  }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.authenticated) {
        this.keycloakAngular.login();
        return;
      }

      // Check user roles on navigation
      const requiredRoles = environment.requiredRoles;

      if (!requiredRoles || requiredRoles.length === 0) {
        return resolve(true);
      } else {
        if (!this.roles || this.roles.length === 0) {
          resolve(false);
        }
        let granted = false;
        for (const requiredRole of requiredRoles) {
          if (this.roles.indexOf(requiredRole) > -1) {
            granted = true;
            break;
          }
        }

        resolve(granted);
        // If user is not allowed redirect to the forbidden page
        if (!granted) {
          this.router.navigateByUrl('/forbidden');
          console.log(this.roles);
        }
      }

    });
  }
}
