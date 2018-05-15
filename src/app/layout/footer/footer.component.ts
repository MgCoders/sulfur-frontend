import { Component, OnInit } from '@angular/core';
import { APPCONFIG } from '../../config';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'my-app-footer',
  styles: [],
  templateUrl: './footer.component.html'
})

export class AppFooterComponent implements OnInit {
  public AppConfig: any;
  public enviroment: any;

  ngOnInit() {
    this.AppConfig = APPCONFIG;
    this.enviroment = environment;
  }
}
