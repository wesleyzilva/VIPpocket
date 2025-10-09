import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    }
    return date.toDateString();
  }

  private _to2digit(n: number): string {
    return ('00' + n).slice(-2);
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && value.includes('/')) {
      const str = value.split('/');
      if (str.length === 3) {
        const day = +str[0];
        const month = +str[1] - 1;
        const year = +str[2];
        return new Date(year, month, day);
      }
    }
    return super.parse(value);
  }
}