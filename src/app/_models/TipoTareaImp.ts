import * as models from './models';

export class TipoTareaImp implements models.TipoTarea {

    id?: number;

    nombre: string;

    codigo: string;

    prioridad: number;

    enabled: boolean;

    public constructor(x: models.TipoTarea) {
        this.id = x.id;
        this.nombre = x.nombre;
        this.codigo = x.codigo;
        this.prioridad = x.prioridad;
        this.enabled = x.enabled;
    }
}
