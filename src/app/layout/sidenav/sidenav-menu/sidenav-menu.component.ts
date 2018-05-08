import { Component, Input } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'my-app-sidenav-menu',
  styles: [],
  templateUrl: './sidenav-menu.component.html'
})

export class AppSidenavMenuComponent {

  public enDesarrollo: boolean;

  constructor(private authService: AuthService) {
    this.enDesarrollo = !environment.production;
  }

  isAdmin() {
    return this.authService.isAuthenticatedAndAdmin();
  }
}
