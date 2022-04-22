import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-criador-visual',
  templateUrl: './criador-visual.component.html',
  styleUrls: ['./criador-visual.component.css']
})
export class CriadorVisualComponent implements OnInit {

  @ViewChild("diagram") diagram:any
  @ViewChild("internDiagram") internDiagram:any
  @ViewChild("internDragableDiagram") internDragableDiagram:any
  @ViewChildren("footerElement") footerElement:any

  constructor() { 
    document.addEventListener("mouseup",()=>{
      this.mouseIsDown = false
    })
  }

  noDeCasas:number = 4
  pixelsPorCasa:number = 60

  qtdeDeCordas = [6,5,4,3,2,1]
  inicialFooter = ['circle-filled','circle-open','circle-open','circle-open','circle-open','circle-open']

  newChord_dedos:number[][] = []
  newChord_footer:string[] = []

  footerSymbols = [
    {
      elementName:'x-path',
      attributesNames:['d','style','id'],
      attributesValues:['M 3.06618,2.35212 4.5654851,0.85418998 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14194 L 3.994976,0.14174008 c -0.0193,-0.0193 -0.04548,-0.0303 -0.07166,-0.0303 -0.02755,0 -0.05237,0.011 -0.07166,0.0303 L 2.350972,1.63829 0.85166597,0.14174008 c -0.03858,-0.0386 -0.104729,-0.0386 -0.143316,0 l -0.570505,0.5705099 c -0.0193,0.0179 -0.0303,0.0441 -0.0303,0.0703 0,0.0276 0.01101,0.0524 0.0303,0.0717 L 1.63715,2.35218 0.13784497,3.84873 c -0.0193,0.0193 -0.0303,0.0441 -0.0303,0.0717 0,0.0262 0.01101,0.0524 0.0303,0.0717 l 0.570505,0.56913 c 0.02067,0.0207 0.04548,0.0303 0.07166,0.0303 0.02618,0 0.05237,-0.01 0.07166,-0.0303 L 2.350976,3.06471 3.85166,4.56126 c 0.03996,0.04 0.103354,0.04 0.143316,0 L 4.5654851,3.99213 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14331 z m 0,0','fill:#333333;fill-opacity:1;stroke-width:0.352778','x-path']
    },
    {
      elementName:'circle-filled',
      attributesNames:['cx','cy','r','style','id'],
      attributesValues:['2.3315','2.3315','2.274132','fill:#333333;stroke:#333333;stroke-width:0.154736;stroke-linecap:square;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;paint-order:markers fill stroke','circle-filled']
    },
    {
      elementName:'circle-open',
      attributesNames:['cx','cy','r','style','id'],
      attributesValues:['2.3315','2.3315','2.274132','fill:none;stroke:#333333;stroke-width:0.154736;stroke-linecap:square;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;paint-order:markers fill stroke','circle-open']
    }
]

  pestanaInicioIndex = 0
  pestanaFinalIndex = 0
  pestanaSpan = 0

  createCells() { 

    //setar alturas dos diagramas conforme a quantidade de casas:
    this.setHeights()

    let count = 0
    while(count < this.noDeCasas * 5){
      let cell = document.createElement("div")
      cell.classList.add("teste")
      this.diagram.nativeElement.appendChild(cell)
      count = count + 1
    }

    let count2 = 0
    while(count2 < this.noDeCasas * 6){
      //MONTAR O INTERNDIAGRAM:
        let dotContainer = document.createElement("div")
        dotContainer.classList.add("dot-container")


        //preencher as células com grey dots (buttons) que aparecem on hover
        let dot = document.createElement("button")
        dot.classList.add("dot")
        dotContainer.appendChild(dot)
        let casaa = Math.floor(count2/6)
        let cordaa = count2-(6*casaa)
        dotContainer.setAttribute("corda-index",cordaa.toString())
        dotContainer.setAttribute("casa-index",casaa.toString())
        dotContainer.classList.add("markable")

        dotContainer.addEventListener("mousedown",(event:any) => {
          let overFret = event.target.getAttribute("casa-index")
          if(event.target.localName == "button"){
            overFret = event.target.parentElement.getAttribute("casa-index")
          }
          for(var i = 0; i < document.getElementsByClassName("dragable").length; i++){

            if(document.getElementsByClassName("dragable")[i].getAttribute("casa-index") == overFret){
              document.getElementsByClassName("dragable")[i].classList.remove("teste2")
              document.getElementsByClassName("dragable")[i].classList.remove("teste3")
              document.getElementsByClassName("dragable")[i].classList.remove("teste4")
            }
  
          }


          this.mouseIsDown = true   
         

          this.clickedString = parseInt(event.target.getAttribute("corda-index"))
          this.clickedFret = parseInt(event.target.getAttribute("casa-index"))

          if(event.target.localName == "button"){
            this.clickedString = parseInt(event.target.parentElement.getAttribute("corda-index"))
            this.clickedFret = parseInt(event.target.parentElement.getAttribute("casa-index"))
          }

        })

        dotContainer.addEventListener("mouseup",()=> {
          this.mouseIsDown = false
          console.log(this.pestanaInicioIndex, this.pestanaFinalIndex)
          document.getElementsByClassName("markable")[this.pestanaInicioIndex].setAttribute("style","grid-column:span 3;")
         // document.getElementsByClassName("markable")[this.pestanaInicioIndex].children[0].setAttribute("style","width:100%;border-radius:20px;background-color:black;")
         document.getElementsByClassName("markable")[this.pestanaInicioIndex].children[0].classList.add("selected-dot")
         document.getElementsByClassName("markable")[this.pestanaInicioIndex].children[0].classList.add("pestana")
          for(var i = 0; i < document.getElementsByClassName("dragable").length; i++){

            if(document.getElementsByClassName("dragable")[i].getAttribute("casa-index") == this.clickedFret.toString()){
              document.getElementsByClassName("dragable")[i].classList.remove("teste2")
              document.getElementsByClassName("dragable")[i].classList.remove("teste3")
              document.getElementsByClassName("dragable")[i].classList.remove("teste4")
            }
  
          }

        })

        dotContainer.addEventListener("mouseover",(event:any) => {
          
          if(this.mouseIsDown){
            let overStringIndex = parseInt(event.target.getAttribute("corda-index")) 
            let overFretIndex = parseInt(event.target.getAttribute("casa-index")) 

            if(event.target.localName == 'button'){
              overStringIndex = parseInt(event.target.parentElement.getAttribute("corda-index")) 
              overFretIndex = parseInt(event.target.parentElement.getAttribute("casa-index"))
            }

            

            let divInicialIndex = this.clickedString+6*this.clickedFret
            this.pestanaInicioIndex = divInicialIndex
            let diff = overStringIndex - this.clickedString
            this.pestanaFinalIndex = divInicialIndex + diff
            this.pestanaSpan = diff
            if(overStringIndex == this.clickedString){
              
              //event.target.classList.remove("teste2")
              document.getElementsByClassName("dragable")[divInicialIndex+diff].classList.remove("teste2")
              document.getElementsByClassName("dragable")[divInicialIndex+diff+1].classList.remove("teste4")
            //  document.getElementsByClassName("dragable")[divInicialIndex+1].classList.remove("teste4")

            } else {
              if(overStringIndex > this.clickedString && this.clickedFret == overFretIndex){
               
               let taPintada = document.getElementsByClassName("dragable")[divInicialIndex+diff].classList.value.includes("teste2") || document.getElementsByClassName("dragable")[divInicialIndex+diff].classList.value.includes("teste3")

               document.getElementsByClassName("dragable")[divInicialIndex].classList.add("teste2")
              
                if(!taPintada){
                  for(var i = 1; i < (overStringIndex-this.clickedString); i++) {
              
                    document.getElementsByClassName("dragable")[divInicialIndex+i].classList.remove("teste4")
                    document.getElementsByClassName("dragable")[divInicialIndex+i].classList.add("teste3")
                  

                  }
                } else {
                  document.getElementsByClassName("dragable")[divInicialIndex+(overStringIndex-this.clickedString)].classList.remove("teste3")
                  document.getElementsByClassName("dragable")[divInicialIndex+(overStringIndex-this.clickedString)+1].classList.remove("teste4")
                }

                //event.target.classList.add("teste4")
                document.getElementsByClassName("dragable")[divInicialIndex+diff].classList.add("teste4")
              
              }

            }

            
          }
          
        
        })
  
        
        //cell.appendChild(dotContainer)
        this.internDiagram.nativeElement.appendChild(dotContainer)
        

        //AO CLICAR EM UM GREY DOT:
        dotContainer.addEventListener("click",(event:any) => {
          
          this.setDot(event) //colocar ou remover (caso já tenha) o black dot

          //LÓGICA PARA PEGAR INFO DOS DEDOS:
          this.getDedos()
          
        })
      ////////////////////////////////////////////////////////////////////////////////
      
      //MONTAR O INTERNDRAGABLE DIAGRAM:
      let dragContainer = document.createElement("div")
      dragContainer.classList.add("dragable")
      dragContainer.classList.add("trans-cell")
      let casa = Math.floor(count2/6)
      let corda = count2-(6*casa)
      dragContainer.setAttribute("corda-index",corda.toString())
      dragContainer.setAttribute("casa-index",casa.toString())

/*       dragContainer.addEventListener("mousedown",(event:any)=> {
        for(var i = 0; i < document.getElementsByClassName("dragable").length; i++){
          if(document.getElementsByClassName("dragable")[i].getAttribute("casa-index") == event.target.getAttribute("casa-index")){
            document.getElementsByClassName("dragable")[i].classList.remove("teste2")
            document.getElementsByClassName("dragable")[i].classList.remove("teste3")
            document.getElementsByClassName("dragable")[i].classList.remove("teste4")
          }

        }
        this.mouseIsDown = true
        this.clickedString = parseInt(event.target.getAttribute("corda-index"))
        this.clickedFret = parseInt(event.target.getAttribute("casa-index"))
      })

      dragContainer.addEventListener("mouseup",()=> {
        this.mouseIsDown = false
      })

      dragContainer.addEventListener("mouseover",(event:any)=>{
        
        let overStringIndex = parseInt(event.target.getAttribute("corda-index")) 
        let overFretIndex = parseInt(event.target.getAttribute("casa-index")) 
        let divInicialIndex = this.clickedString+6*this.clickedFret


        if(this.mouseIsDown){

          if(overStringIndex == this.clickedString){

            event.target.classList.remove("teste2")
            document.getElementsByClassName("dragable")[divInicialIndex+1].classList.remove("teste4")

          } else {

            if(overStringIndex > this.clickedString && this.clickedFret == overFretIndex) {
              let taPintada = event.target.classList.value.includes("teste3") || event.target.classList.value.includes("teste2")
    
            
              document.getElementsByClassName("dragable")[divInicialIndex].classList.add("teste2")

              if(!taPintada){
                for(var i = 1; i < (overStringIndex-this.clickedString); i++) {
              
                    document.getElementsByClassName("dragable")[divInicialIndex+i].classList.remove("teste4")
                    document.getElementsByClassName("dragable")[divInicialIndex+i].classList.add("teste3")
                  

                }
              } else {
                document.getElementsByClassName("dragable")[divInicialIndex+(overStringIndex-this.clickedString)].classList.remove("teste3")
                document.getElementsByClassName("dragable")[divInicialIndex+(overStringIndex-this.clickedString)+1].classList.remove("teste4")
                
              }
              
              event.target.classList.add("teste4")
              
            } else {
              console.log("ando pa traaaaaaaaaaais")
            }


          }
       
        }
      }) */


      this.internDragableDiagram.nativeElement.appendChild(dragContainer)



      count2 = count2 + 1
    }

    this.setInicialFooter()
  }

  mouseIsDown = false
  clickedString = 0
  clickedFret = 0

  setHeights() {
    //setar alturas dos diagramas conforme a quantidade de casas:
    let height = this.pixelsPorCasa * this.noDeCasas
    let fator = 3 * this.noDeCasas + 3
    let internRowsHeight = (height - fator)/this.noDeCasas
    this.diagram.nativeElement.setAttribute("style", "height:"+height+"px; grid-template-rows:repeat(" + this.noDeCasas +",1fr)")
    this.internDiagram.nativeElement.setAttribute("style", "height:"+(height-3)+"px; grid-template-rows:repeat(" + this.noDeCasas +"," + internRowsHeight + "px)")
    this.internDragableDiagram.nativeElement.setAttribute("style", "height:"+(height-3)+"px; grid-template-rows:repeat(" + this.noDeCasas +"," + internRowsHeight + "px)")
  }

  setDot(event:any){
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
  }

  setInicialFooter(){
    for(var i = 0; i < this.inicialFooter.length; i++){
      let svg = document.createElementNS("http://www.w3.org/2000/svg","svg")
      svg.setAttribute("width","35px")
      svg.setAttribute("viewBox","0 0 4.703 4.703")
      
      let circle = document.createElementNS("http://www.w3.org/2000/svg","circle")
      let inicialFooterActualSymbol = this.footerSymbols.filter(e => e.elementName == this.inicialFooter[i])[0]

      for(var a = 0 ; a < inicialFooterActualSymbol.attributesNames.length; a++){
        circle.setAttribute(inicialFooterActualSymbol.attributesNames[a],inicialFooterActualSymbol.attributesValues[a])
      }

      svg.appendChild(circle)
      this.footerElement._results[i].nativeElement.appendChild(svg)
    }
  }

  getDedos() {
    //LÓGICA PARA PEGAR INFO DOS DEDOS:
    this.newChord_dedos = []
    for(var i = 0; i < this.internDiagram.nativeElement.children.length; i++){
      let button = this.internDiagram.nativeElement.children[i].children[0]
      if(button.classList.value.includes("selected-dot")){
        let casa = Math.ceil((i+1)/6)
        let corda = 6 * casa - i
        this.newChord_dedos.push([corda,casa])
      }
    }
    console.log(this.newChord_dedos)
  }

  getFooter() {
    this.newChord_footer = []
    this.footerElement._results.forEach((item:any) => {
      this.newChord_footer.push(item.nativeElement.children[0].children[0].id)
    })
  }

  changeFooter(footerElement:any, corda:number){

    let svg = footerElement.children[0]

    let clickedFooterElementId = svg.children[0].id

    let indexDoSimboloAtual = this.footerSymbols.map(e => e.elementName).indexOf(this.footerSymbols.map(e => e.elementName).filter(e => e == clickedFooterElementId)[0])
    

    let indexNext
    if(indexDoSimboloAtual < 2){
      indexNext = indexDoSimboloAtual + 1
    } else {
      indexNext = 0
    }

    if(this.footerSymbols[indexNext].elementName.includes('circle')){
      let circle = document.createElementNS("http://www.w3.org/2000/svg","circle")
      for(var i= 0; i < this.footerSymbols[indexNext].attributesNames.length; i++){
        circle.setAttribute(this.footerSymbols[indexNext].attributesNames[i],this.footerSymbols[indexNext].attributesValues[i])
      }
      svg.innerHTML = ''
      svg.appendChild(circle)
    } else {
      let path = document.createElementNS("http://www.w3.org/2000/svg","path")
      for(var i=0; i < this.footerSymbols[indexNext].attributesNames.length; i++){
        path.setAttribute(this.footerSymbols[indexNext].attributesNames[i],this.footerSymbols[indexNext].attributesValues[i])
      }
      svg.innerHTML = ''
      svg.appendChild(path)
    }

    this.getFooter()

  }

  ngOnInit(): void {    
  }

  ngAfterViewInit() {
    this.createCells()

  }

}
