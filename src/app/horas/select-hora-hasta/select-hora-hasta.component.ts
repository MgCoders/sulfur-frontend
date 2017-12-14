import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import { AlertService } from '../../_services/alert.service';

@Component({
  selector: 'app-select-hora-hasta',
  templateUrl: './select-hora-hasta.component.html',
  styleUrls: ['./select-hora-hasta.component.scss']
})
export class SelectHoraHastaComponent implements OnInit {

  @Input() object: any;
  @Input() idModel: string;
  @Input() placeHolder: string;
  @Input() horaStart: string;

  @Output() onChange: EventEmitter<{id: number, desc: string, hora: string}> = new EventEmitter<{id: number, desc: string, hora: string}>();

  public lista: any[];
  public hourdiv: number;

  constructor(private as: AlertService) { }

  ngOnInit() {
      this.lista = [];
      this.hourdiv = 4;
      const h: number = +this.horaStart.split(':')[0];
      const m: number = +this.horaStart.split(':')[1];
      const startVal: number = (h * 4) + ((m * this.hourdiv) / 60);
      this.loadValues(startVal);
  }

  public loadValues(desde: number) {

    this.lista = [];

    const iter: number = 24 * this.hourdiv;
    for (let _i = desde; _i < iter; _i++) {

      const dif: number = _i - desde;
      const horasTotales: string = (Math.floor((_i - desde) / this.hourdiv)).toString();
      const minutosTotales: string = (Math.floor((_i - desde) % this.hourdiv) * (60 / this.hourdiv)).toString();

      let aux: string = '';
      if (Math.floor(_i / this.hourdiv) < 10) {
        aux += '0';
      }
      aux += Math.floor(_i / this.hourdiv).toString();

      aux += ':';

      if ((_i % this.hourdiv) * (60 / this.hourdiv) < 10) {
        aux += '0';
      }
      aux += ((_i % this.hourdiv) * (60 / this.hourdiv)).toString();

      const horaStr: string = aux;

      aux += ' (' + horasTotales + 'h. ' + minutosTotales + 'm.)';

      this.lista.push({id: _i, desc: aux, hora: horaStr});
    }
  }

  public getIndexOfValue(val: string): number {
    return this.lista.indexOf((x) => x.hora === val);
  }

  onChangeValue(evt) {
    this.onChange.emit(this.lista.find((x) => x.hora === evt.value));
  }
}
