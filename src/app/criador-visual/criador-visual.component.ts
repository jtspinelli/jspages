import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-criador-visual',
  templateUrl: './criador-visual.component.html',
  styleUrls: ['./criador-visual.component.css']
})
export class CriadorVisualComponent implements OnInit {

  @ViewChild("diagram") diagram:any
  @ViewChild("internDiagram") internDiagram:any

  constructor() { }

  noDeCasas:number = 4

  createCells() {
    let count = 0
    let count2 = 0
    while(count < this.noDeCasas * 5){
      let cell = document.createElement("div")
      cell.classList.add("teste")
      this.diagram.nativeElement.appendChild(cell)
      count = count + 1
    }

    while(count2 < this.noDeCasas * 5 + 4){
      let cell = document.createElement("div")
      let dotContainer = document.createElement("div")
      dotContainer.classList.add("dot-container")
      dotContainer.addEventListener("click",(event:any) => {
        if(event.target.localName == 'button'){
          if(event.target.parentElement.children[0].classList.value.includes("selected-dot")){
            let dot = document.createElement("button")
            dot.classList.add("dot")
            event.target.parentElement.appendChild(dot)
            event.target.parentElement.children[0].remove()
          } else {
           
            let dot = document.createElement("button")
            dot.classList.add("selected-dot")
            event.target.parentElement.appendChild(dot)
            event.target.parentElement.children[0].remove()
          }
          
        }
        
      })
      let dot = document.createElement("button")
      dot.classList.add("dot")
      dotContainer.appendChild(dot)
      cell.classList.add("trans-cell")
      cell.appendChild(dotContainer)
      this.internDiagram.nativeElement.appendChild(cell)
      count2 = count2 + 1
    }
  }

  ngOnInit(): void {    
  }

  ngAfterViewInit() {
    this.createCells()
  }

}
