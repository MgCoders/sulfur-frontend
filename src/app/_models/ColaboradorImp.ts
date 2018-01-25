import * as models from './models';

export class ColaboradorImp {
    id?: number;

    email: string;

    nombre: string;

    cargo?: models.Cargo;

    role: string;

    token?: string;

    public constructor(x: models.Colaborador) {
        this.id = x.id;
        this.nombre = x.nombre;
        this.email = x.email;
        this.cargo = x.cargo;
        this.role = x.role;
        this.token = x.token;
    }
}
