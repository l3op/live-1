import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(lives: Array<any>, user_search: String): any {
    if(!user_search) return lives
    var result = []
    for(let live of lives) {
      if(live.title.toLowerCase().includes(user_search.toLowerCase()) ){
        result.push(live)
      }
    }
    return result;
  }

}
