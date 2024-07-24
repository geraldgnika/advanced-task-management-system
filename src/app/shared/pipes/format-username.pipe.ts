import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatUsername' })
export class FormatUsernamePipe implements PipeTransform {
	transform(username: string): string {
        if (!username) {
          return '';
        }
    
        return `@${username.trim()}`;
      }
}
