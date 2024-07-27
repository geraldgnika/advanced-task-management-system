import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TaskPriorityTranslationKeys } from '../../core/types/enums/task/task-priority';
import { TaskStatusTranslationKeys } from '../../core/types/enums/task/task-status';

@Pipe({
  name: 'translateEnum',
  // pure: false
})
export class TranslateEnumPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string, enumType: 'priority' | 'status'): string {
    const translationKeys = enumType === 'priority' ? TaskPriorityTranslationKeys : TaskStatusTranslationKeys;
    const key = translationKeys[value as keyof typeof translationKeys];
    return this.translateService.instant(key);
  }
}