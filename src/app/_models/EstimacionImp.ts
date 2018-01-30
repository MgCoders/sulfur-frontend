/**
 * Sulfur backend
 * El login exitoso de UserService devuelve un Colaborador con un campo \"token\". Dicho token se debe incluir como header de las llamadas del resto de las operaciones de cada servicio.
 *
 * OpenAPI spec version: 1.0-SNAPSHOT
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from './models';
import { EstimacionCargoImp } from './EstimacionCargoImp';

export class EstimacionImp {
    id?: number;

    proyecto: models.Proyecto;

    descripcion?: string;

    fecha: string;

    estimacionCargos?: models.EstimacionCargo[];

    public constructor(x: models.Estimacion) {
        this.id = x.id;
        this.proyecto = x.proyecto;
        this.descripcion = x.descripcion;
        this.fecha = x.fecha;

        this.estimacionCargos = new Array();
        x.estimacionCargos.forEach((y) => {
            this.estimacionCargos.push(new EstimacionCargoImp(y));
        });
    }
}
