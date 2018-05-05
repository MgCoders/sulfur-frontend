import { NativeDateAdapter } from '@angular/material';

// Se extiende el adaptador Nativo para las entradas manuales.
export class CustomDateAdapter extends NativeDateAdapter {

    parse(value: any): Date | null {

        if (typeof value === 'string') {
            if ((value.indexOf('/') > -1) && value.split('/').length === 3) {
                const str = value.split('/');
                const year = Number(str[2]);
                const month = Number(str[1]) - 1;
                const day = Number(str[0]);
                const fecha: Date = new Date(year, month, day);
                const ingresada: string = '' + day + month + year;
                const construida: string = '' + fecha.getDate() + fecha.getMonth() + fecha.getFullYear();
                if (ingresada === construida) {
                    return fecha;
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        }

        const timestamp = typeof value === 'number' ? value : Date.parse(value);
        return isNaN(timestamp) ? undefined : new Date(timestamp);
    }

/*     format(date: Date, displayFormat: object): string {
        if (!this.isValid(date)) {
          throw Error('NativeDateAdapter: Cannot format invalid date.');
        }

        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
      } */
}
