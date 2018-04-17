import * as models from './models';
import { CustomDatePipe } from '../_pipes/customDate.pipe';
import { PrecioHora } from './models';

export class CargoImp implements models.Cargo {

    id?: number;

    nombre: string;

    codigo: string;

    precioHoraHistoria?: models.PrecioHora[];

    enabled: boolean;

    ultimoPrecio: number;

    public constructor(x: models.Cargo) {
        this.id = x.id;
        this.nombre = x.nombre;
        this.codigo = x.codigo;
        this.enabled = x.enabled;

        this.precioHoraHistoria = new Array();
        x.precioHoraHistoria.forEach((y) => {
            this.precioHoraHistoria.push(new models.PrecioHoraImp(y));
        });

        const datePipe: CustomDatePipe = new CustomDatePipe();
        this.precioHoraHistoria.sort((a: models.PrecioHoraImp, b: models.PrecioHoraImp) => {
            const fA: Date = datePipe.transform(a.vigenciaDesde, ['']);
            const fB: Date = datePipe.transform(b.vigenciaDesde, ['']);
            return fB.getTime() - fA.getTime();
        });
        this.ultimoPrecio = this.precioHoraHistoria.length > 0 ? this.precioHoraHistoria[0].precioHora : 0;
    }
}
