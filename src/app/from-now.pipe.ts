import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

@Pipe({
  name: 'fromNow',
  standalone: true
})
export class FromNowPipe implements PipeTransform {
  transform(date: string): string {
    return formatDistanceToNowStrict(parseISO(date), { addSuffix: true });
  }
}
