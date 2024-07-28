import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlightMentions'
})
export class HighlightMentionsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    
    const mentionRegex = /@(\w+)/g;
    const highlightedText = value.replace(mentionRegex, '<span class="text-primary">$&</span>');
    
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }
}