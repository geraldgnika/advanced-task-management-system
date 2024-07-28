import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TaskPriorityTranslationKeys } from '../../core/types/enums/task/task-priority';
import { TaskStatusTranslationKeys } from '../../core/types/enums/task/task-status';

@Pipe({
  name: 'translateEnum',
  pure: false,
})
export class TranslateEnumPipe implements PipeTransform, OnDestroy {
  private value: string = '';
  private translatedValue: string = '';
  private subscription: Subscription;
  enumType!: 'priority' | 'status';

  constructor(private translateService: TranslateService) {
    this.subscription = this.translateService.onLangChange.subscribe(() => {
      this.translatedValue = this.translateValue(this.value);
    });
  }

  transform(value: string, enumType: 'priority' | 'status'): string {
    this.enumType = enumType;
    this.value = value;
    this.translatedValue = this.translateValue(value);
    return this.translatedValue;
  }

  private translateValue(value: string): string {
    const translationKeys =
      this.enumType === 'priority'
        ? TaskPriorityTranslationKeys
        : TaskStatusTranslationKeys;
    const key = translationKeys[value as keyof typeof translationKeys];
    return this.translateService.instant(key);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
