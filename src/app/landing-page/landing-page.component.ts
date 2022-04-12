import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private router:Router) { }

  navigate(page:string){
    if(page == 'cf'){
      window.location.href = "https://jonatesch.github.io/projetocontrolefinanceiro/paginaprincipal/login"
    } else {
      this.router.navigate(['/'+page])
    }
    
  }

  ngOnInit(): void {
  }

}
