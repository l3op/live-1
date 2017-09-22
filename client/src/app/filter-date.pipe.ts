import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDate'
})
export class FilterDatePipe implements PipeTransform {

  transform(list: Array<any>, filter: any): any {
    var result = []
    if(filter == '') {
      return list
    }
    for(let val of list) {
      if(filter == 'future') {
        if (new Date(val.date_time).getFullYear() > new Date().getFullYear()) {
          result.push(val)
        } else if (new Date(val.date_time).getFullYear() == new Date().getFullYear()) {
          if(new Date(val.date_time).getMonth() > new Date().getMonth()) {
            result.push(val)
          } else if (new Date(val.date_time).getMonth() == new Date().getMonth() ) {
              if(new Date(val.date_time).getDate() > new Date().getDate()) {
                result.push(val)
              }
          }
        }

      }
      if(filter == 'current') {
        if(new Date(val.date_time).getFullYear() == new Date().getFullYear() && new Date(val.date_time).getMonth() == new Date().getMonth() &&  new Date(val.date_time).getDate() == new Date().getDate()) {
          result.push(val)
        }
    }
    if(filter == 'past') {
      if (new Date(val.date_time).getFullYear() < new Date().getFullYear()) {
        result.push(val)
      } else if (new Date(val.date_time).getFullYear() == new Date().getFullYear()) {
        if(new Date(val.date_time).getMonth() < new Date().getMonth()) {
          result.push(val)
        } else if (new Date(val.date_time).getMonth() == new Date().getMonth() ) {
            if(new Date(val.date_time).getDate() < new Date().getDate()) {
              result.push(val)
            }
        }
      }
      }
    }
    return result
  }
}
