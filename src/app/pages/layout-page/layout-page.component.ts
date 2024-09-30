import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
  ]
})
export class LayoutPageComponent {
  constructor(
    public router:Router
  ){}

  goToList(){
    this.router.navigate(['/tasks'])
  }
}
