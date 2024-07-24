import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalizeFirstLetter' })
export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return value.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }
}
