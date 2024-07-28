import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatUsernames' })
export class FormatUsernamesPipe implements PipeTransform {
  transform(value: string[]): string {
    if (!value || !Array.isArray(value)) {
      return '';
    }

    return value.map((username) => `@${username.trim()}`).join(', ');
  }
}
