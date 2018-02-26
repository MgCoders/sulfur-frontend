import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColaboradorService } from '../../_services/colaborador.service';
import { AlertService } from '../../_services/alert.service';
import { Colaborador } from '../../_models/models';

@Component({
  selector: 'app-select-colaborador',
  templateUrl: './select-colaborador.component.html',
  styleUrls: ['./select-colaborador.component.scss']
})
export class SelectColaboradorComponent implements OnInit {

    @Input() object: any;
    @Input() idModel: string;
    @Input() placeHolder: string;
    @Input() id: string;
    @Input() desc: string;

    @Output() onChange: EventEmitter<Colaborador> = new EventEmitter<Colaborador>();

    public lista: Colaborador[];

    constructor(private service: ColaboradorService,
                private as: AlertService) { }

    ngOnInit() {
      this.lista = new Array();
      this.service.getAll().subscribe(
        (data) => {
          this.lista = data;
        },
        (error) => {
          this.as.error(error, 5000);
        });
    }

    onChangeValue(evt) {
      this.onChange.emit(this.lista.find((x) => x.id === evt.value));
    }
  }
