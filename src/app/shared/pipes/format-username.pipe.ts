import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatUsername' })
export class FormatUsernamePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value == null || value === undefined) {
      return '';
    }

    let trimmedValue = value.trim().replace(/^@+/, '');

    if (trimmedValue === '') {
      return '@';
    }

    return '@' + trimmedValue;
  }
}
