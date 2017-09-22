import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCity'
})
export class FilterCityPipe implements PipeTransform {

  transform(list: Array<any>, city: any): any {
    if(city == '') return list 
    var result = []
    for(let val of list) {
      if(val.city == city) {
        result.push(val)
      }
    }
    return result;
  }

}
