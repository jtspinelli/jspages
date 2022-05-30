import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private router:Router) { }

  projects = [
    {name:'googlepicker', url:'https://jtspinelli02.github.io/googlepicker/'},
    {name:'controlefinanceiro', url:'https://jonatesch.github.io/projetocontrolefinanceiro/paginaprincipal/movimentacoes'},
    {name:'geradordeacordes', url:'https://jtspinelli.github.io/jspages/pool'}
  ]

  navigate(page:string){
    if(page == 'cf'){
      window.location.href = "https://jonatesch.github.io/projetocontrolefinanceiro/paginaprincipal/login"
    } else {
      if(page == 'googlepicker'){
        window.location.href = 'https://jtspinelli02.github.io/googlepicker/'
      } else {
        this.router.navigate(['/'+page])
      }
      
    }
    
  }

  showProject(project:string) {
    let url = this.projects.filter(e => e.name == project)[0].url
    document.getElementById('iframe')?.setAttribute('src',url) 
 
    document.getElementById("iframe")?.scrollIntoView({behavior:'smooth'})
  }

  ngOnInit(): void {
  }

}
