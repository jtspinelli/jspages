import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { GenerateChordService } from '../generate-chord.service';

@Component({
  selector: 'criador-click',
  templateUrl: './criador-click.component.html',
  styleUrls: ['./criador-click.component.css']
})
export class CriadorClickComponent implements OnInit {

  constructor(private _generateChordService:GenerateChordService) { 
    document.addEventListener("mouseup", () => {
      this.mouseIsDown = false
      this.clearPestanaShadowDaCasa()
      if(this.rightClickedDotContainerIndex && this.usingFingerSelector == false) {
        let contextMenu = document.getElementsByClassName("finger-diagram")[0].children[this.rightClickedDotContainerIndex].children[1]
       
        contextMenu.classList.add("hidden")
        this.rightClickedDotContainerIndex = undefined
      }
      
    })

    document.body.addEventListener("mouseup", () => {
      
    })
  }

  @ViewChild("diagram") diagram:any
  @Output() enviarAcorde:EventEmitter<any> = new EventEmitter()

  newChordName = ''
  positions = [1,2,3,4,5,6,7,8,9]
  newChordPosition = 1
  newChordFooter:string[] = ['O','o','o','o','o','o']

  noDeCasas:number = 5
  pixelsPorCasa:number = 60

  mouseIsDown:boolean = false
  cordaClicadaIndex:number = 0
  casaClicadaIndex:number = 0
  shadowInit = 0
  shadowSpan = 0
  shadowSpanTrue = 0

  fingers:number[][] = []
  pestana:any[] = []

  indexDoElementoDaCasaClicado = 0
  indexDaShadowDivClicada:number = 0

  defaultFooter = [
    'assets/o_filled.svg',
    'assets/o.svg',
    'assets/o.svg',
    'assets/o.svg',
    'assets/o.svg',
    'assets/o.svg'
  ]

  rightClickedDotContainerIndex:number | undefined
  usingFingerSelector:boolean = false


  createDiagram() {

    this.setDiagramCells()

    this.createShadowDiagram()

    this.createFingerDiagram()

    this.createNumbersDiagram()

    this.setDiagramsHeight()

  }

  setDiagramsHeight() {
    let diagram = this.diagram.nativeElement
    let internDiagram = document.getElementsByClassName("shadow-diagram")[0]
    let fingerDiagram = document.getElementsByClassName("finger-diagram")[0]
    let numbersDiagram = document.getElementsByClassName("numbers-diagram")[0]
   
    //setar altura do diagrama base conforme a quantidade de casas:
    let height = this.pixelsPorCasa * this.noDeCasas
    let fator = 3 * this.noDeCasas + 3
    let internRowsHeight = (height - fator)/this.noDeCasas

    diagram.setAttribute("style", "height:"+height+"px; grid-template-rows:repeat(" + this.noDeCasas +",1fr)")
    internDiagram.setAttribute("style", "height:"+(height-3)+"px; grid-template-rows:repeat(" + this.noDeCasas +"," + internRowsHeight + "px)")
    fingerDiagram.setAttribute("style", "height:"+(height-3)+"px; grid-template-rows:repeat(" + this.noDeCasas +"," + internRowsHeight + "px)")
    numbersDiagram.setAttribute("style", "height:"+(height-3)+"px; grid-template-rows:repeat(" + this.noDeCasas +"," + internRowsHeight + "px)")
  }

  setInternDiagramHeight() {

    /* let height = this.pixelsPorCasa * this.noDeCasas
    let fator = 3 * this.noDeCasas + 3
    let internRowsHeight = (height - fator)/this.noDeCasas

    document.getElementsByClassName("shadow-diagram")[0].setAttribute("style", "height:"+(height-3)+"px; grid-template-rows:repeat(" + this.noDeCasas +"," + internRowsHeight + "px)") */

  }

  createShadowDiagram() {
    let diagram = this.diagram.nativeElement

    let shadowDiagram = document.createElement("div")
    shadowDiagram.classList.add("shadow-diagram")
    diagram.appendChild(shadowDiagram)

    this.setShadowDiagramDivs()
  }

  createFingerDiagram() {
    let diagram = this.diagram.nativeElement

    let fingerDiagram = document.createElement("div")
    fingerDiagram.classList.add("finger-diagram")
    diagram.appendChild(fingerDiagram)

    this.setFingerDiagramDivs()
  }

  createNumbersDiagram() {
    let diagram = this.diagram.nativeElement

    let numbersDiagram = document.createElement("div")
    numbersDiagram.classList.add("numbers-diagram")
    diagram.appendChild(numbersDiagram)

    this.setNumbersDiagramDivs()
  }

  setDiagramCells() {
    let diagram = this.diagram.nativeElement

    let count = 0
    while(count < this.noDeCasas * 5){
      let cell = document.createElement("div")
      cell.classList.add("cell")

      diagram.appendChild(cell)
      count = count + 1
    }    
  }

  setShadowDiagramDivs() {
    
    let count = 0
    while(count < this.noDeCasas * 6) {
      let div = document.createElement("div")
      div.classList.add("shadow-container")
      let casa = Math.floor(count/6)
      let corda = count-(6*casa)
      div.setAttribute("corda-index",corda.toString())
      div.setAttribute("casa-index",casa.toString())

      div.addEventListener("click",(event:any)=> {
       let classes = event.target.classList.value
       if(classes.includes("cap") || classes.includes("mid") || classes.includes("end")){
         this.clearPestanaShadowDaCasa()
       }

     //  this.toggleShadowDot(event)
     this.toggleShadowDot(false)

      })

      div.addEventListener("mousedown", (event:any) => {
        this.mouseIsDown = true
        this.setarCasaCordaClicada(event) 
        this.setarElementoClicado()
        
        if(event.target.classList.value.includes("pestana-mark")){
          for(var i = 0; i < document.getElementsByClassName("shadow-container").length; i++){
            if(document.getElementsByClassName("shadow-container")[i].getAttribute("casa-index") == this.casaClicadaIndex.toString() && document.getElementsByClassName("shadow-container")[i].classList.value.includes("pestana-mark")) {
              document.getElementsByClassName("shadow-container")[i].classList.remove("pestana-mark")
            }
          }
          this.pestana.splice(this.pestana.map(e => e.casa).indexOf(this.casaClicadaIndex + 1),1)
          
        }
      })

      div.addEventListener("mouseover", (event:any) => {
        let casaOverIndex = parseInt(event.target.getAttribute("casa-index")) 
        let cordaOverIndex = parseInt(event.target.getAttribute("corda-index"))

        //verificar se botão do mouse está pressionado e se a casa em que o mouse está é a mesma da clicada:
        if(this.mouseIsDown && casaOverIndex == this.casaClicadaIndex ){
          this.setFirstShadowIndex()
          this.setarPestana(cordaOverIndex,casaOverIndex) //seta array de pestana que vai para o gerador de acorde svg
          this.clearPestanaShadowDaCasa()

          
          this.shadowSpan = cordaOverIndex - this.cordaClicadaIndex

          /* if(this.cordaClicadaIndex > cordaOverIndex){
            this.shadowSpanTrue = this.cordaClicadaIndex - cordaOverIndex
            console.log(this.shadowSpanTrue)
          } */


          //PESTANA DO GRAVE PRO AGUDO:
          if(this.shadowSpan > 0) {
            let firstShadowDiv = document.getElementsByClassName("shadow-container")[this.shadowInit]
            firstShadowDiv.classList.add("cap")

            for(var i = 1; i < this.shadowSpan; i++) {
              let middleShadowDiv = document.getElementsByClassName("shadow-container")[this.shadowInit + i]
              middleShadowDiv.classList.remove("end")
              middleShadowDiv.classList.add("mid")
            }

            event.target.classList.add("end")
          }

          //PESTANA DO AGUDO PRO GRAVE:
          if(this.shadowSpan < 0) {
            let firstShadowDiv = document.getElementsByClassName("shadow-container")[this.shadowInit]
            firstShadowDiv.classList.add("end")

            for(var i = this.shadowInit+this.shadowSpan+1; i < this.shadowInit; i++) {
              
              let middleShadowDiv = document.getElementsByClassName("shadow-container")[i]
              middleShadowDiv.classList.remove("cap")
              middleShadowDiv.classList.add("mid")
            }

            event.target.classList.add("cap")
          }
        
        }
        
      })

      div.addEventListener("mouseup", (event:any) => {
        this.mouseIsDown = false
        this.clearPestanaShadowDaCasa() //sumir a sombrinha

        //SE O MOUSE DESCEU NUMA CORDA E SUBIU EM OUTRA, MONTAR PESTANA:
        let cordaOverIndex = parseInt(event.target.getAttribute("corda-index"))
        let casaOverIndex = parseInt(event.target.getAttribute("casa-index"))
        if(cordaOverIndex !== this.cordaClicadaIndex && casaOverIndex == this.casaClicadaIndex){
          //this.criarPestana() //criar 'de fato' a pestana, black button
          this.toggleShadowDot(true)
        }
        
        
      })

      div.addEventListener("contextmenu",(event:any) => {
        if(event.target.classList.value.includes("shadow-container-dot")){
          event.preventDefault()
          let shadowContainers = document.getElementsByClassName("shadow-container")
          let shadowDivIndex = 0
          for(var i = 0; i < shadowContainers.length; i++) {
            let condition1 = shadowContainers[i].getAttribute("casa-index") == this.casaClicadaIndex.toString()
            let condition2 = shadowContainers[i].getAttribute("corda-index") == this.cordaClicadaIndex.toString()
            if(condition1 && condition2){
              shadowDivIndex = i
            }
          }
          let index = this.diagramCorresp.map(e => e.casaIndex).indexOf(this.diagramCorresp.map(e => e.casaIndex).filter(e => e == this.casaClicadaIndex)[0])
          let correspElements = this.diagramCorresp[index].elements
          let booleanMap = correspElements.map(e => e.includes(shadowDivIndex))
          let booleanTrueIndex = booleanMap.indexOf(true)
          let clickedDotContainer = document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt + booleanTrueIndex]
          this.rightClickedDotContainerIndex = this.casas[this.casaClicadaIndex].startAt + booleanTrueIndex
          clickedDotContainer.children[1].classList.remove("hidden")
        }
        
      })

      document.getElementsByClassName("shadow-diagram")[0].appendChild(div)

      count = count + 1

    }

  }

  setarPestana(cordaOverIndex:number, casaOverIndex:number) {
    let cordas = [
      {index:0, number:6},
      {index:1, number:5},
      {index:2, number:4},
      {index:3, number:3},
      {index:4, number:2},
      {index:5, number:1}
    ]

    //deletar elemento de pestana caso já haja na casa clicada:
    this.excluirPestanaDaCasa()

    //lógica pra funcionar montando a pestana da esquerda pra direita ou da direita pra esquerda:
    let start = cordas[this.cordaClicadaIndex].number
    let end = cordas[cordaOverIndex].number

    if(start < end) {
      this.pestana.push({fromString:end, toString:start, casa:casaOverIndex + 1})
    } else {
      this.pestana.push({fromString:start, toString:end, casa:casaOverIndex + 1})
    }
  }

  criarPestana() {
    for(var i = this.shadowInit; i < this.shadowInit + this.shadowSpan + 1; i++){
      let container = document.getElementsByClassName("shadow-container")[i]
      container.classList.add("shadow-container-dot")
    }

    let booleans = this.getNumberOfContainers().booleans
    let counts = this.getNumberOfContainers().counts

    //AJUSTAR A CLASSE DO PRIMEIRO ELEMENTO DA CASA:
    document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].className = ''
    let classToAdd = "fgr-span" + counts[0]
    document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].classList.add(classToAdd)

    //se tem mais de 1 divisão, CRIAR NOVOS ELEMENTOS DA CASA:
    if(counts.length > 1) {
      for(var i = counts.length-1; i > 0; i--) {
        let div = document.createElement("div")
        let classToNewEl = "fgr-span" + counts[i]
        div.classList.add(classToNewEl)
        div.setAttribute("casa-index",this.casaClicadaIndex.toString())
        
        /* if(booleans[i] == true) {
          let button = document.createElement("button")
          button.classList.add("fgr-dot")
          div.appendChild(button)
        } */

        

        document.getElementsByClassName("finger-diagram")[0].insertBefore(div,document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].nextElementSibling)

      }
    }
    
  }

  excluirPestanaDaCasa() {
    if(this.pestana.map(e => e.casa).filter(e => e == this.casaClicadaIndex + 1)[0]) {
      let indexToRemove = this.pestana.map(e => e.casa).indexOf(this.casaClicadaIndex+1)
      this.pestana.splice(indexToRemove,1)
    }
  }

  setFingerDiagramDivs() {
    for(var i = 0; i < this.noDeCasas; i++){
      let div = document.createElement("div")
      div.classList.add("fgr-span6")
      div.setAttribute("casa-index",i.toString())
      div.setAttribute("element","1")
      document.getElementsByClassName("finger-diagram")[0].appendChild(div)
    }
  }

  setNumbersDiagramDivs() {
    for(var i = 0; i < this.noDeCasas; i++){
      let div = document.createElement("div")
      div.classList.add("fgr-span6")
      div.setAttribute("casa-index",i.toString())
      div.setAttribute("element","1")
      document.getElementsByClassName("numbers-diagram")[0].appendChild(div)
    }
  }

  clearPestanaShadowDaCasa(){
    //limpar a marcação 'shadow' de pestana
    for(var a = 0; a < document.getElementsByClassName("shadow-container").length; a++){
      let element = document.getElementsByClassName("shadow-container")[a]
      let elementCasa = element.getAttribute("casa-index")
      if(elementCasa == this.casaClicadaIndex.toString()){
        element.classList.remove("cap")
        element.classList.remove("mid")
        element.classList.remove("end")
      }
    }
  }

  setFirstShadowIndex(){
    let shadowContainersLength = document.getElementsByClassName("shadow-container").length
    let shadowContainers = document.getElementsByClassName("shadow-container")
    let index

    for(var i = 0; i < shadowContainersLength; i++) {
      if(shadowContainers[i].getAttribute("corda-index") == this.cordaClicadaIndex.toString() && shadowContainers[i].getAttribute("casa-index") == this.casaClicadaIndex.toString()){
        index = i
        this.shadowInit = i
      } 
    }
    
  }

  setarCasaCordaClicada(event:any){
    this.cordaClicadaIndex = parseInt(event.target.getAttribute("corda-index")) 
    this.casaClicadaIndex = parseInt(event.target.getAttribute("casa-index"))
  }

  setarElementoClicado() {
    let shadowContainersLength = document.getElementsByClassName("shadow-container").length
    let shadowContainers = document.getElementsByClassName("shadow-container")
    let index = 0
    for(var i = 0; i < shadowContainersLength; i++) {
      if(shadowContainers[i].getAttribute("corda-index") == this.cordaClicadaIndex.toString() && shadowContainers[i].getAttribute("casa-index") == this.casaClicadaIndex.toString()){
        index = i
      } 
    }

    this.indexDaShadowDivClicada = index


    let indexDoElemento = 0

    if(index) {
  
      for(var i = 0; i < this.diagramCorresp[this.casaClicadaIndex].elements.length; i++ ) {
        
        if(this.diagramCorresp[this.casaClicadaIndex].elements[i].includes(index) == true) {
          indexDoElemento = i
        }

      }
    }
    
    this.indexDoElementoDaCasaClicado = this.casas[this.casaClicadaIndex].startAt + indexDoElemento
    
    
  }

  toggleShadowDot(pestana:boolean) {
    let cordas = [
      {index:0, number:6},
      {index:1, number:5},
      {index:2, number:4},
      {index:3, number:3},
      {index:4, number:2},
      {index:5, number:1}
      ]
    if(pestana == false) {
      
      
      let shadowDivClicada = document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada]

    
      if(shadowDivClicada.classList.value.includes("shadow-container-dot")){//se a célula já tem a classe do dot
        shadowDivClicada.classList.remove("shadow-container-dot") //remover classe
        shadowDivClicada.classList.remove("has-number") //remover classe


        //lógica para remover o array referente a esse dot do array de dedos:
        let fingersToObject = this.fingers.map(e => { return {
          corda:e[0],
          casa:e[1]
        }
        })
        let dotToRemoveIndex = fingersToObject.indexOf(fingersToObject.filter(e => e.corda == cordas[cordas.map(e => e.index).indexOf(this.cordaClicadaIndex)].number && e.casa == this.casaClicadaIndex + 1)[0]) 
        this.fingers.splice(dotToRemoveIndex,1)
      } else {//se a célula não tem a classe do dot
        shadowDivClicada.classList.add("shadow-container-dot") //adicionar classe

        //E SETAR ARRAY COM AS INFORMAÇÕES DE DEDOS:
        this.fingers.push([cordas[cordas.map(e => e.index).indexOf(this.cordaClicadaIndex)].number,this.casaClicadaIndex + 1])
    
      }
    }

    if(pestana == true) {

      //AJUSTE NECESSÁRIO CASO PESTANA TENHA SIDO FEITA DA DIREITA PRA ESQUERDA (do agudo pro grave)
      if(this.shadowSpan < 0) {
        this.shadowSpan = this.shadowSpan * -1
        this.shadowInit = this.shadowInit - this.shadowSpan
      }


      for(var i = this.shadowInit; i < this.shadowInit + this.shadowSpan + 1; i++){
        document.getElementsByClassName("shadow-container")[i].classList.add("pestana-mark")
      }
      
      
    }


   //**********PASSO 1) LÓGICA DE RESET DA CASA****************

    let qtdeAntiga = this.casas[this.casaClicadaIndex].divisoes.length
    let aRemover = qtdeAntiga - 1
    

    //RESETAR TAMANHO DO ELEMENTO ÚNICO DA CASA
    let casaStartIndex = this.casas[this.casaClicadaIndex].startAt
    let fgrContainers = document.getElementsByClassName("finger-diagram")[0].children
    fgrContainers[casaStartIndex].className = ''
    fgrContainers[casaStartIndex].classList.add("fgr-span6")

    //CASO TENHA DOT NO ELEMENTO ÚNICO DA CASA, REMOVER
    if(fgrContainers[casaStartIndex].children.length > 0) {
      fgrContainers[casaStartIndex].children[0].remove()
      fgrContainers[casaStartIndex].children[0].remove()
      
    }

    //REMOVER DEMAIS ELEMENTOS DA CASA
    for(var m = 1; m <= aRemover; m++) {
      fgrContainers[casaStartIndex+1].remove()
    }

    //reconfigurar o número de divisões da casa (um elemento de span/largura 6):
    this.casas[this.casaClicadaIndex].divisoes = [6]

    //reconfigurar o índice de início das casas seguintes
    for(var i = 1; i < this.casas.length - this.casaClicadaIndex; i++) {
      this.casas[this.casaClicadaIndex+i].startAt = this.casas[this.casaClicadaIndex+i].startAt - aRemover
    }


   //*******************************************************************  

    //**********PASSO 1.1) LÓGICA DE RESET DA CASA DE NUMERO DE DEDO****************
    

    //RESETAR TAMANHO DO ELEMENTO ÚNICO DA CASA
    let numbersContainers = document.getElementsByClassName("numbers-diagram")[0].children
    numbersContainers[casaStartIndex].className = ''
    numbersContainers[casaStartIndex].classList.add("fgr-span6")

    //CASO TENHA ALGO NO ELEMENTO ÚNICO DA CASA, REMOVER
    numbersContainers[casaStartIndex].textContent = ''
    //REMOVER DEMAIS ELEMENTOS DA CASA
    for(var m = 1; m <= aRemover; m++) {
      numbersContainers[casaStartIndex+1].remove()
    }


   //*******************************************************************  
   
   
   //PASSO 2) LÓGICA DE CONSTRUÇÃO DOS BLACK DOTS DA CASA
    let booleans = this.getNumberOfContainers().booleans
    let counts = this.getNumberOfContainers().counts
    let booleansOfNumberMarks = this.getNumberOfContainers().booleansOfNumberMarks
    let dotsNumbers = this.getNumberOfContainers().dotsNumbers


    //AJUSTAR A CLASSE DO PRIMEIRO ELEMENTO DA CASA:
    fgrContainers[casaStartIndex].className = ''
    let classToAdd = "fgr-span" + counts[0]
    fgrContainers[casaStartIndex].classList.add(classToAdd)

    //COLOCAR DOT NO PRIMEIRO ELEMENTO CASO TENHA
    if(booleans[0] == true) {
      //botão:
      let button = document.createElement("button")
      button.classList.add("fgr-dot")
      document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].appendChild(button)

      //criar seletor de dedo
      let dedoSelect = document.createElement("div")
      dedoSelect.classList.add("finger-selector")
      dedoSelect.classList.add("hidden")
      dedoSelect.addEventListener("mouseenter", () => {
        this.usingFingerSelector = true
      })
      dedoSelect.addEventListener("mouseleave", () => {
        this.usingFingerSelector = false
      })
      let lista = document.createElement("ul")
      lista.classList.add("finger-list")
     
      let dedo1 = document.createElement("li")
      dedo1.addEventListener("click",() => {
        if(this.rightClickedDotContainerIndex || this.rightClickedDotContainerIndex == 0) {
          document.getElementsByClassName("numbers-diagram")[0].children[this.rightClickedDotContainerIndex].textContent = "1"
          document.getElementsByClassName("finger-diagram")[0].children[this.rightClickedDotContainerIndex].children[1].classList.add("hidden")
          document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].classList.add("has-number")
          document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].setAttribute("num","1")

        let corda = cordas.filter(e => e.index == this.cordaClicadaIndex)[0].number
          let casa = this.casaClicadaIndex+1
          let fingerInfoIndex = this.fingers.indexOf(this.fingers.filter(e => e[0] == corda && e[1] == casa)[0])
          if(this.fingers[fingerInfoIndex].length == 3){
            this.fingers[fingerInfoIndex].splice(2,1)
          }
          this.fingers[fingerInfoIndex].push(1)
          
          this.atualizarPreview()
        } 
      })
      dedo1.classList.add("finger-selector-item")
      dedo1.textContent = "1"
      let dedo2 = document.createElement("li")
      dedo2.addEventListener("click",() => {
        if(this.rightClickedDotContainerIndex || this.rightClickedDotContainerIndex == 0) {
          document.getElementsByClassName("numbers-diagram")[0].children[this.rightClickedDotContainerIndex].textContent = "2"
          document.getElementsByClassName("finger-diagram")[0].children[this.rightClickedDotContainerIndex].children[1].classList.add("hidden")
          document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].classList.add("has-number")
          document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].setAttribute("num","2")

          let corda = cordas.filter(e => e.index == this.cordaClicadaIndex)[0].number
          let casa = this.casaClicadaIndex+1
          let fingerInfoIndex = this.fingers.indexOf(this.fingers.filter(e => e[0] == corda && e[1] == casa)[0])
          if(this.fingers[fingerInfoIndex].length == 3){
            this.fingers[fingerInfoIndex].splice(2,1)
          }
          this.fingers[fingerInfoIndex].push(2)
          this.atualizarPreview()
        }            
      })
      dedo2.classList.add("finger-selector-item")
      dedo2.textContent = "2"
      let dedo3 = document.createElement("li")
      dedo3.addEventListener("click",() => {
        if(this.rightClickedDotContainerIndex || this.rightClickedDotContainerIndex == 0) {
          document.getElementsByClassName("numbers-diagram")[0].children[this.rightClickedDotContainerIndex].textContent = "3"
          document.getElementsByClassName("finger-diagram")[0].children[this.rightClickedDotContainerIndex].children[1].classList.add("hidden")
          document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].classList.add("has-number")
          document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].setAttribute("num","3")

          let corda = cordas.filter(e => e.index == this.cordaClicadaIndex)[0].number
          let casa = this.casaClicadaIndex+1
          let fingerInfoIndex = this.fingers.indexOf(this.fingers.filter(e => e[0] == corda && e[1] == casa)[0])
          if(this.fingers[fingerInfoIndex].length == 3){
            this.fingers[fingerInfoIndex].splice(2,1)
          }
          this.fingers[fingerInfoIndex].push(3)
          this.atualizarPreview()
        }        
      })
      dedo3.classList.add("finger-selector-item")
      dedo3.textContent = "3"
      let dedo4 = document.createElement("li")
      dedo4.addEventListener("click",() => {
        if(this.rightClickedDotContainerIndex || this.rightClickedDotContainerIndex == 0) {
          document.getElementsByClassName("numbers-diagram")[0].children[this.rightClickedDotContainerIndex].textContent = "4"
          document.getElementsByClassName("finger-diagram")[0].children[this.rightClickedDotContainerIndex].children[1].classList.add("hidden")
          document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].classList.add("has-number")
          document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].setAttribute("num","4")

          let corda = cordas.filter(e => e.index == this.cordaClicadaIndex)[0].number
          let casa = this.casaClicadaIndex+1
          let fingerInfoIndex = this.fingers.indexOf(this.fingers.filter(e => e[0] == corda && e[1] == casa)[0])
          if(this.fingers[fingerInfoIndex].length == 3){
            this.fingers[fingerInfoIndex].splice(2,1)
          }
          this.fingers[fingerInfoIndex].push(4)
          this.atualizarPreview()
        }        
      })
      dedo4.classList.add("finger-selector-item")
      dedo4.textContent = "4"

      lista.appendChild(dedo1)
      lista.appendChild(dedo2)
      lista.appendChild(dedo3)
      lista.appendChild(dedo4)

      dedoSelect.appendChild(lista)

      document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].appendChild(dedoSelect)

    }

    //CRIAR NOVOS ELEMENTOS DA CASA (se terá mais de 1 divisão):
    if(counts.length > 1) {
      for(var i = counts.length-1; i > 0; i--) {
        let div = document.createElement("div")
        let classToNewEl = "fgr-span" + counts[i]
        div.classList.add(classToNewEl)
        div.setAttribute("casa-index",this.casaClicadaIndex.toString())
        let elementNumber = i + 1
        div.setAttribute("element",elementNumber.toString())
        
        if(booleans[i] == true) {
          //criar botão
          let button = document.createElement("button")
          button.classList.add("fgr-dot")
          div.appendChild(button)

          //criar seletor de dedo
          let dedoSelect = document.createElement("div")
          dedoSelect.classList.add("finger-selector")
          dedoSelect.classList.add("hidden")
          dedoSelect.addEventListener("mouseenter", () => {
            this.usingFingerSelector = true
          })
          dedoSelect.addEventListener("mouseleave", () => {
            this.usingFingerSelector = false
          })
          let lista = document.createElement("ul")
          lista.classList.add("finger-list")
         
          let dedo1 = document.createElement("li")
          dedo1.addEventListener("click",() => {
            if(this.rightClickedDotContainerIndex) {
              document.getElementsByClassName("numbers-diagram")[0].children[this.rightClickedDotContainerIndex].textContent = "1"
              document.getElementsByClassName("finger-diagram")[0].children[this.rightClickedDotContainerIndex].children[1].classList.add("hidden")
              document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].classList.add("has-number")
              document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].setAttribute("num","1")
              
              let corda = cordas.filter(e => e.index == this.cordaClicadaIndex)[0].number
              let casa = this.casaClicadaIndex+1
              let fingerInfoIndex = this.fingers.indexOf(this.fingers.filter(e => e[0] == corda && e[1] == casa)[0])
              if(this.fingers[fingerInfoIndex].length == 3){
                this.fingers[fingerInfoIndex].splice(2,1)
              }
              this.fingers[fingerInfoIndex].push(1)
              this.atualizarPreview()
            }        
          })
          dedo1.classList.add("finger-selector-item")
          dedo1.textContent = "1"
          let dedo2 = document.createElement("li")
          dedo2.addEventListener("click",() => {
            if(this.rightClickedDotContainerIndex) {
              document.getElementsByClassName("numbers-diagram")[0].children[this.rightClickedDotContainerIndex].textContent = "2"
              document.getElementsByClassName("finger-diagram")[0].children[this.rightClickedDotContainerIndex].children[1].classList.add("hidden")
              document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].classList.add("has-number")
              document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].setAttribute("num","2")

              let corda = cordas.filter(e => e.index == this.cordaClicadaIndex)[0].number
              let casa = this.casaClicadaIndex+1
              let fingerInfoIndex = this.fingers.indexOf(this.fingers.filter(e => e[0] == corda && e[1] == casa)[0])
              if(this.fingers[fingerInfoIndex].length == 3){
                this.fingers[fingerInfoIndex].splice(2,1)
              }
              this.fingers[fingerInfoIndex].push(2)
              this.atualizarPreview()
            }            
          })
          dedo2.classList.add("finger-selector-item")
          dedo2.textContent = "2"
          let dedo3 = document.createElement("li")
          dedo3.addEventListener("click",() => {
            if(this.rightClickedDotContainerIndex) {
              document.getElementsByClassName("numbers-diagram")[0].children[this.rightClickedDotContainerIndex].textContent = "3"
              document.getElementsByClassName("finger-diagram")[0].children[this.rightClickedDotContainerIndex].children[1].classList.add("hidden")
              document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].classList.add("has-number")
              document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].setAttribute("num","3")

              let corda = cordas.filter(e => e.index == this.cordaClicadaIndex)[0].number
              let casa = this.casaClicadaIndex+1
              let fingerInfoIndex = this.fingers.indexOf(this.fingers.filter(e => e[0] == corda && e[1] == casa)[0])
              if(this.fingers[fingerInfoIndex].length == 3){
                this.fingers[fingerInfoIndex].splice(2,1)
              }
              this.fingers[fingerInfoIndex].push(3)
              this.atualizarPreview()
            }        
          })
          dedo3.classList.add("finger-selector-item")
          dedo3.textContent = "3"
          let dedo4 = document.createElement("li")
          dedo4.addEventListener("click",() => {
            if(this.rightClickedDotContainerIndex) {
              document.getElementsByClassName("numbers-diagram")[0].children[this.rightClickedDotContainerIndex].textContent = "4"
              document.getElementsByClassName("finger-diagram")[0].children[this.rightClickedDotContainerIndex].children[1].classList.add("hidden")
              document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].classList.add("has-number")
              document.getElementsByClassName("shadow-container")[this.indexDaShadowDivClicada].setAttribute("num","4")

              let corda = cordas.filter(e => e.index == this.cordaClicadaIndex)[0].number
              let casa = this.casaClicadaIndex+1
              let fingerInfoIndex = this.fingers.indexOf(this.fingers.filter(e => e[0] == corda && e[1] == casa)[0])
              if(this.fingers[fingerInfoIndex].length == 3){
                this.fingers[fingerInfoIndex].splice(2,1)
              }
              this.fingers[fingerInfoIndex].push(4)
              this.atualizarPreview()
            }        
          })
          dedo4.classList.add("finger-selector-item")
          dedo4.textContent = "4"

          lista.appendChild(dedo1)
          lista.appendChild(dedo2)
          lista.appendChild(dedo3)
          lista.appendChild(dedo4)

          dedoSelect.appendChild(lista)

          div.appendChild(dedoSelect)

         
         
        }
        document.getElementsByClassName("finger-diagram")[0].insertBefore(div,fgrContainers[casaStartIndex].nextElementSibling)
       
        
        

      }
    }

    //SETAR NOVO VALOR DE DIVISÃO DA CASA:
    this.casas[this.casaClicadaIndex].divisoes = []
    counts.forEach(count => {
      this.casas[this.casaClicadaIndex].divisoes.push(count)
    })

    //SETAR NOVO VALOR DE STARTAT DAS CASAS SEGUINTES:
    for(var i = 1; i < this.casas.length - this.casaClicadaIndex; i++) {
      this.casas[this.casaClicadaIndex+i].startAt = this.casas[this.casaClicadaIndex+i].startAt + (counts.length - 1)
    }


    //AJUSTAR DIAGRAMA DE CORRESPONDÊNCIAS (usado pra catar mais rapidamente a div com botão a partir da divShadow clicada)
    let teste:any[] = []

    let nums = []
    for(var i = 0; i< 6; i++) {
      nums.push(i+(this.casaClicadaIndex*6))
    }

    let last = 0
    for(var i = 0; i < counts.length; i++) {
      let elem:any[] = []

      
      for(var a = 0; a < counts[i]; a++) {

        elem.push(nums[last+a])
        
      }
      last = nums.indexOf(nums[last+a])
      teste.push(elem)
    }
    this.diagramCorresp[this.casaClicadaIndex].elements = teste


    this.atualizarPreview()


   //*******************************************************************  
   
   
   //PASSO 2.1) LÓGICA DE CONSTRUÇÃO DOS ESPAÇOS PARA RECEBER NÚMERO DE DEDOS


   //AJUSTAR A CLASSE DO PRIMEIRO ELEMENTO DA CASA:
   numbersContainers[casaStartIndex].className = ''
   numbersContainers[casaStartIndex].classList.add(classToAdd)
   numbersContainers[casaStartIndex].classList.add("numbers")

   //COLOCAR NÚMERO NO PRIMEIRO ELEMENTO CASO TENHA
   if(booleansOfNumberMarks[0] == true) {
     document.getElementsByClassName("numbers-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].textContent = dotsNumbers[0]
   }

   //CRIAR NOVOS ELEMENTOS DA CASA (se terá mais de 1 divisão):
   if(counts.length > 1) {
     for(var i = counts.length-1; i > 0; i--) {
       let div = document.createElement("div")
       let classToNewEl = "fgr-span" + counts[i]
       div.classList.add(classToNewEl)
       div.classList.add("numbers")
       div.setAttribute("casa-index",this.casaClicadaIndex.toString())
       let elementNumber = i + 1
       div.setAttribute("element",elementNumber.toString())
       
       
       if(booleansOfNumberMarks[i] == true) {
         div.textContent = dotsNumbers[i]
       }

       document.getElementsByClassName("numbers-diagram")[0].insertBefore(div,numbersContainers[casaStartIndex].nextElementSibling)

  

     }
   }
  
  }

  toggleShadowDotAntigo(event:any) {
    let cordas = [
      {index:0, number:6},
      {index:1, number:5},
      {index:2, number:4},
      {index:3, number:3},
      {index:4, number:2},
      {index:5, number:1}
    ]

    let cell = event.target
    if(cell.classList.value.includes("shadow-container-dot")){ //se a célula já tem a classe do dot
      cell.classList.remove("shadow-container-dot") //remover classe

      //lógica para remover o array referente a esse dot do array de dedos:
      let fingersToObject = this.fingers.map(e => { return {
        corda:e[0],
        casa:e[1]
      }
      })
      let dotToRemoveIndex = fingersToObject.indexOf(fingersToObject.filter(e => e.corda == cordas[cordas.map(e => e.index).indexOf(this.cordaClicadaIndex)].number && e.casa == this.casaClicadaIndex + 1)[0]) 
      this.fingers.splice(dotToRemoveIndex,1)

    } else { //se a célula não tem a classe do dot
      cell.classList.add("shadow-container-dot") //adicionar classe

      //E SETAR ARRAY COM AS INFORMAÇÕES DE DEDOS:
      this.fingers.push([cordas[cordas.map(e => e.index).indexOf(this.cordaClicadaIndex)].number,this.casaClicadaIndex + 1])
      
    } 



    


    //LÓGICA PARA POPULAR O DIAGRAMA DE BLACK DOTS:
    let booleans = this.getNumberOfContainers().booleans
    let counts = this.getNumberOfContainers().counts

    //REMOVER DEMAIS ELEMENTOS DA CASA (SEM CONTAR O PRIMEIRO (i=1 e não 0), E CASO TENHA MAIS DE UM)
    if(this.casas[this.casaClicadaIndex].divisoes.length > 1) {
      for(var i = 1; i < this.casas[this.casaClicadaIndex].divisoes.length; i++) {
        document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt+1].remove()
      }
    }


    //CASO TENHA BOTAO NO PRIMEIRO ELEMENTO DA CASA, REMOVER:
    if(document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].children.length > 0) {
      document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].children[0].remove()
    }

    //CASO TENHA DOT PRA COLOCAR NO PRIMEIRO ELEMENTO, COLOCAR:
    if(booleans[0] == true) {
      let button = document.createElement("button")
      button.classList.add("fgr-dot")
      document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].appendChild(button)
    }
    
    //E ENTÃO AJUSTAR A CLASSE DO PRIMEIRO ELEMENTO DA CASA:
    document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].className = ''
    let classToAdd = "fgr-span" + counts[0]
    document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].classList.add(classToAdd)
    


    //SETAR NOVOS VALORES DE DIVISÕES E STARTAT DAS CASAS:
    let antigo = this.casas[this.casaClicadaIndex].divisoes.length

    //reconfigurar a quantidade de elementos da casa
         //this.casas[this.casaClicadaIndex].divisoes.length = counts.length
    this.casas[this.casaClicadaIndex].divisoes = []
    counts.forEach(count => {
      this.casas[this.casaClicadaIndex].divisoes.push(count)
    })

    let teste:any[] = []

    let nums = []
    for(var i = 0; i< 6; i++) {
      nums.push(i+(this.casaClicadaIndex*6))
    }

    let last = 0
    for(var i = 0; i < counts.length; i++) {
      let elem:any[] = []

      
      for(var a = 0; a < counts[i]; a++) {

        elem.push(nums[last+a])
        
      }
      last = nums.indexOf(nums[last+a])
      teste.push(elem)
    }
    this.diagramCorresp[this.casaClicadaIndex].elements = teste



    let diff = counts.length - antigo

    //reconfigurar o índice de início das casas seguintes
    for(var i = 1; i < this.casas.length - this.casaClicadaIndex; i++) {
      this.casas[this.casaClicadaIndex+i].startAt = this.casas[this.casaClicadaIndex+i].startAt + diff
    }
    


    //se tem mais de 1 divisão, CRIAR NOVOS ELEMENTOS DA CASA:
    if(counts.length > 1) {
      for(var i = counts.length-1; i > 0; i--) {
        let div = document.createElement("div")
        let classToNewEl = "fgr-span" + counts[i]
        div.classList.add(classToNewEl)
        div.setAttribute("casa-index",this.casaClicadaIndex.toString())
        let elementNumber = i + 1
        div.setAttribute("element",elementNumber.toString())
        
        if(booleans[i] == true) {
          let button = document.createElement("button")
          button.classList.add("fgr-dot")
          div.appendChild(button)
        }

        document.getElementsByClassName("finger-diagram")[0].insertBefore(div,document.getElementsByClassName("finger-diagram")[0].children[this.casas[this.casaClicadaIndex].startAt].nextElementSibling)

      }
    }

    for(var i = 0; i < document.getElementsByClassName("finger-diagram")[0].children.length; i++) {
      if(document.getElementsByClassName("finger-diagram")[0].children[i].getAttribute("casa-index") == this.casaClicadaIndex.toString()){
       // console.log(document.getElementsByClassName("finger-diagram")[0].children[i])
      }
    }

    //console.log(this.diagramCorresp)
    
  }


  //VARIÁVEIS PARA ARRUMAR (fazer dinamicamente pegando a variável noDeCasas)
  casas = [
    {index:0, startAt:0, divisoes:[6]},
    {index:1, startAt:1, divisoes:[6]},
    {index:2, startAt:2, divisoes:[6]},
    {index:3, startAt:3, divisoes:[6]},
    {index:4, startAt:4, divisoes:[6]}
  ]

  diagramCorresp = [
    {casaIndex: 0, elements:[[0,1,2,3,4,5]]},
    {casaIndex: 1, elements:[[6,7,8,9,10,11]]},
    {casaIndex: 2, elements:[[12,13,14,15,16,17]]},
    {casaIndex: 3, elements:[[18,19,20,21,22,23]]},
    {casaIndex: 4, elements:[[24,25,26,27,28,29]]}
  ]

  getNumberOfContainers() {
    let booleans:any[] = []
    let booleansOfNumberMarks:boolean[] = []
    let dotsNumbers = []
    let counts:number[] = []
    let num = 0
    let temBlackDot:boolean = false


    //setar array booleans, para determinar quantos containers a casa terá:

    for(var i = 0; i < document.getElementsByClassName("shadow-container").length; i++){
      if(document.getElementsByClassName("shadow-container")[i].classList.value.includes("shadow-container-dot") && document.getElementsByClassName("shadow-container")[i].getAttribute("casa-index") == this.casaClicadaIndex.toString()){
        temBlackDot = true
      }
    }

    //SE TIVER DOT NA CASA (cria divisões considerando dots e pestana)
    if(temBlackDot == true) {
      for(var i = 0; i < document.getElementsByClassName("shadow-container").length; i++) {
        if(document.getElementsByClassName("shadow-container")[i].getAttribute("casa-index") == this.casaClicadaIndex.toString()){
          let elBoolean = document.getElementsByClassName("shadow-container")[i].classList.value.includes("shadow-container-dot")
          let elBooleanP = document.getElementsByClassName("shadow-container")[i].classList.value.includes("pestana-mark")
          let elBooleanN = document.getElementsByClassName("shadow-container")[i].classList.value.includes("has-number")
          let dotNum = document.getElementsByClassName("shadow-container")[i].getAttribute("num")

          if(elBoolean !== booleans[booleans.length-1]) {
            booleansOfNumberMarks.push(elBooleanN)
            if(dotNum){
              dotsNumbers.push(dotNum)
            } else {
              dotsNumbers.push("none")
            }
            if(elBoolean == true) {
              if(elBoolean == true) {
                booleans.push(true)
                counts[num] = 1
                num = num + 1 
              }
            } else { //DIFERENTE MAS FALSO
              if(elBooleanP == true) { 
                if(document.getElementsByClassName("shadow-container")[i-1].classList.value.includes("pestana-mark") == true) {
                  counts[num-1] = counts[num-1] + 1
                } else {
                  booleans.push(true)
                counts[num] = 1
                num = num + 1 
                }
                
              } else {
                booleans.push(false)
                counts[num] = 1
                num = num + 1 
              }
              
            }
            
          } else {
            
            if(elBoolean == true) {
              if(elBooleanN == true){
                booleansOfNumberMarks.push(elBooleanN)
                if(dotNum){
                  dotsNumbers.push(dotNum)
                } else {
                  dotsNumbers.push("none")
                }
              }
              booleans.push(true)
             counts[num] = 1
             num = num + 1 
            } else {
              if(elBooleanP == false) {
                counts[num-1] = counts[num-1] + 1
              } else {
                booleans.push(true)
                counts[num] = 1
                num = num + 1 
              }
            } 
          }

        


  
          /* if(elBoolean !== booleans[booleans.length-1]){
            booleans.push(elBoolean)
            counts[num] = 1
            num = num + 1
            
          } else {
            
            if(elBoolean == booleans[booleans.length-1] && elBoolean == true){
              booleans.push(elBoolean)
              counts[num] = 1
              num = num + 1
            } else {
              counts[num-1] = counts[num-1] + 1
            }
            
          } */

          
        }
        
      }

    //SE NÃO TEM DOT NA CASA, FAZER A DIVISÃO CONSIDERANDO APENAS PESTANA:  
    } else {
      for(var i = 0; i < document.getElementsByClassName("shadow-container").length; i++) {
        if(document.getElementsByClassName("shadow-container")[i].getAttribute("casa-index") == this.casaClicadaIndex.toString()){
         
          let elBooleanP = document.getElementsByClassName("shadow-container")[i].classList.value.includes("pestana-mark")

  
          if(elBooleanP !== booleans[booleans.length-1]){
            booleans.push(elBooleanP)
            counts[num] = 1
            num = num + 1
            
          } else {
            counts[num-1] = counts[num-1] + 1            
            
          }
          
        }
        
      }

    }

    /* //CÓDIGO ANTIGO, SEM CONSIDERAR A PESTANA:
        //setar array booleans, para determinar quantos containers a casa terá:
        for(var i = 0; i < document.getElementsByClassName("shadow-container").length; i++) {
          if(document.getElementsByClassName("shadow-container")[i].getAttribute("casa-index") == this.casaClicadaIndex.toString()){
            let elBoolean = document.getElementsByClassName("shadow-container")[i].classList.value.includes("shadow-container-dot")
            
            if(elBoolean !== booleans[booleans.length-1]){
              booleans.push(elBoolean)
              counts[num] = 1
              num = num + 1
              
            } else {
              
              if(elBoolean == booleans[booleans.length-1] && elBoolean == true){
                booleans.push(elBoolean)
                counts[num] = 1
                num = num + 1
              } else {
                counts[num-1] = counts[num-1] + 1
              }
              
            }
            
          }
          
        } */

    
    return({booleans:booleans, counts:counts, booleansOfNumberMarks:booleansOfNumberMarks, dotsNumbers:dotsNumbers})
  }
  
  atualizarPreview() {
    let pestanaInstr:number[][] = []
    this.pestana.forEach((pest:any) => {
      let temp:number[] = []
      temp.push(pest.fromString)
      temp.push(pest.toString)
      temp.push(pest.casa)
      pestanaInstr.push(temp)
    })


    let acorde = this._generateChordService.SVGchord_gerarAcorde(false,1,'customChord',this.newChordName,this.fingers,this.newChordFooter,pestanaInstr,this.newChordPosition)
    acorde.classList.add("destacar")

    document.getElementById("acordeNovo")?.firstChild?.remove()
    document.getElementById("acordeNovo")?.appendChild(acorde)

  }

  changeFooter(event:any, index:number) {
    let footerOptions:any[] = [
      {name:'O', link:'assets/o_filled.svg'},
      {name:'o', link:'assets/o.svg'},
      {name:'x', link:'assets/x.svg'}
    ]
    let indexDoAtual = footerOptions.map(e => e.link).indexOf(footerOptions.map(e => e.link).filter(e => e == event.target.getAttribute("src"))[0])
    let indexProximo = indexDoAtual

    if(indexDoAtual+1 > 2) {
      indexProximo = 0
    } else {
      indexProximo = indexDoAtual + 1
    }

    event.target.setAttribute("src",footerOptions[indexProximo].link)

    this.newChordFooter[index] = footerOptions[indexProximo].name

    this.atualizarPreview()
    
  }

  makeId(length:number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
  }

  sendChord() {

    let pestanaInstr:number[][] = []
    this.pestana.forEach((pest:any) => {
      let temp:number[] = []
      temp.push(pest.fromString)
      temp.push(pest.toString)
      temp.push(pest.casa)
      pestanaInstr.push(temp)
    })

    let qtde = this._generateChordService.qtde

    let customId = this.makeId(5)
    let fingers = Object.assign([],this.fingers)
    let footer = Object.assign([],this.newChordFooter)
   
    let customChordg = this._generateChordService.SVGchord_gerarAcorde(true,qtde,'customChord'+customId,this.newChordName,this.fingers,this.newChordFooter,pestanaInstr,this.newChordPosition)
    let customChord = {g:customChordg, structure:{
      dedos:fingers,
      footer:footer,
      id:'customChord_'+customId,
      ordenadorMaiores:0,
      pestana:pestanaInstr,
      title:this.newChordName,
      position:this.newChordPosition
    }}
    
    this.enviarAcorde.emit(customChord)
  }

  ngOnInit(): void {
    let acorde = this._generateChordService.SVGchord_gerarAcorde(false,1,'customChord','',[],this.newChordFooter,[])
    acorde.classList.add("destacar")

    document.getElementById("acordeNovo")?.firstChild?.remove()
    document.getElementById("acordeNovo")?.appendChild(acorde)
  }

  ngAfterViewInit() {
    this.createDiagram()
  }

}
