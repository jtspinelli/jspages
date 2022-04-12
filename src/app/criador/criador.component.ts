import { Component, OnInit, ViewChildren } from '@angular/core';
import { GenerateChordService } from '../generate-chord.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-criador',
  templateUrl: './criador.component.html',
  styleUrls: ['./criador.component.css']
})
export class CriadorComponent implements OnInit {

  @ViewChildren('footerSymbolsSelects') footerSymbolsSelects:any

  dot1:string = ''
  dot2:string = ''
  dot3:string = ''
  dot4:string = ''

  dots:number[][] = []

  footerSymbols:string[] = ["x","●","○"]

  stringsIds:string[] = ['string6','string5','string4','string3','string2','string1']

  selectedFooter:string[] = ['●','○','○','○','○','○']
  footerToSend = ['O','o','o','o','o','o']

  newChordTitle = ''

  pestana:number[] = []
  pestanaInput = ''

  positionInput = ''
  position:number = 1

  setarDots() {
    this.dots = []
    if(this.dot1.length > 2){
      let dot1Splited = this.dot1.split(',')
      let dot1ToNumber:number[] = []
      dot1Splited.forEach(string => {
        dot1ToNumber.push(parseInt(string))
      })
      if(dot1ToNumber[0]>0 && dot1ToNumber[0]<7 && dot1ToNumber[1]>0 && dot1ToNumber[1]<6){
        this.dots.push(dot1ToNumber)
      }
      
    }
    if(this.dot2.length > 2){
      let dot2Splited = this.dot2.split(',')
      let dot2ToNumbers:number[] = []
      dot2Splited.forEach(string => {
        dot2ToNumbers.push(parseInt(string))
      })
      if(dot2ToNumbers[0]>0 && dot2ToNumbers[0]<7 && dot2ToNumbers[1]<6 && dot2ToNumbers[1]>0){
        this.dots.push(dot2ToNumbers)
      }
      
    }
    if(this.dot3.length > 2){
      let dot3Splited = this.dot3.split(',')
      let dot3ToNumbers:number[] = []
      dot3Splited.forEach(string => {
        dot3ToNumbers.push(parseInt(string))
      })
      if(dot3ToNumbers[0]>0 && dot3ToNumbers[0]<7 && dot3ToNumbers[1]<6 && dot3ToNumbers[1]>0) {
        this.dots.push(dot3ToNumbers)
      }
      
    }
    if(this.dot4.length > 2){
      let dot4Splited = this.dot4.split(',')
      let dot4ToNumbers:number[] = []
      dot4Splited.forEach(string => {
        dot4ToNumbers.push(parseInt(string))
      })
      if(dot4ToNumbers[0]>0 && dot4ToNumbers[0]<7 && dot4ToNumbers[1]<6 && dot4ToNumbers[1]>0) {
        this.dots.push(dot4ToNumbers)
      }
      
      
    }

    if(this.position<2){
      document.getElementById("acorde")?.children[0].remove()
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,1)
      document.getElementById("acorde")?.appendChild(newChord)
    } else {
      document.getElementById("acorde")?.children[0].remove()
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,this.position)
      document.getElementById("acorde")?.appendChild(newChord)
    }


   /*  if(this.dots.length > 0){ */

/*       document.getElementById("acorde")?.children[0].remove()
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana)
      document.getElementById("acorde")?.appendChild(newChord) */
   /*  } else {
      document.getElementById("acorde")?.children[0].remove()
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,[],this.footerToSend,this.pestana)
      document.getElementById("acorde")?.appendChild(newChord)
    } */
    

    

    //console.log(this.dots)
  }

  setarFooter(evento:any) {
    let id = evento.target.id
    let footers:any[] = this.footerSymbolsSelects._results
    let index = footers.map(e => e.nativeElement.id).indexOf(id)
    let selectedSymbol = evento.target.value
    let originalValue = this.selectedFooter[index]

    let basses = this.selectedFooter.filter(e => e == '●' || e == 'O').length
    let xStrings = this.selectedFooter.filter(e => e == 'x').length
    
    if(selectedSymbol == '●' && basses > 0) {
      alert("o acorde já possui baixo!")
      if(originalValue == '○' || originalValue == 'o'){
        footers[index].nativeElement.value = '○'
      } else {
        footers[index].nativeElement.value = originalValue
      }
      
    } else {
      if(xStrings == 5 && selectedSymbol == 'x') {
        alert("o acorde deve ter ao menos uma corda tocada!")
        if(originalValue == '○' || originalValue == 'o'){
          footers[index].nativeElement.value = '○'
        } 
        if(originalValue == '●' || originalValue == 'O'){
          footers[index].nativeElement.value = '●'
        }
        if(originalValue == 'x'){
          footers[index].nativeElement.value = originalValue
        }
      } else {
        this.selectedFooter[index] = selectedSymbol

        for(var i=0; i<this.selectedFooter.length; i++) {
          if(this.selectedFooter[i] == '●'){
            this.selectedFooter[i] = 'O'
          }
          if(this.selectedFooter[i] == '○'){
            this.selectedFooter[i] = 'o'
          }
        }
      }
      
    }

    this.footerToSend = []
    this.footerToSend = Object.assign([],this.selectedFooter)
    for(var i = 0; i<this.footerToSend.length; i++) {
      if(this.footerToSend[i] == '●'){
        this.footerToSend[i] == 'O'
      }
      if(this.footerToSend[i] == '○'){
        this.footerToSend[i] == 'o'
      }

    }

    if(this.position<2){
      document.getElementById("acorde")?.children[0].remove()
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,1)
      document.getElementById("acorde")?.appendChild(newChord)
    } else {
      document.getElementById("acorde")?.children[0].remove()
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,this.position)
      document.getElementById("acorde")?.appendChild(newChord)
    }



  }

  setarTitle(){
    document.getElementById("acorde")?.children[0].remove()
    if(this.position <2){
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,1)
      document.getElementById("acorde")?.appendChild(newChord)
    } else {
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,this.position)
      document.getElementById("acorde")?.appendChild(newChord)
    }

  }

  setarPestana(){
    this.pestana = []
    let pestanaSplited = this.pestanaInput.split(',')
    let pestanaToNumbers:number[] = []
    pestanaSplited.forEach(item => {
      if(item !== ''){
        pestanaToNumbers.push(parseInt(item))
      }
    })
    if(pestanaToNumbers[0]>0 && pestanaToNumbers[0]<7 && pestanaToNumbers[1]>0 && pestanaToNumbers[1]<7 && pestanaToNumbers[1]<pestanaToNumbers[0] && pestanaToNumbers[2]>0 && pestanaToNumbers[2]<6){
      this.pestana = pestanaToNumbers
      if(this.position<2){
        document.getElementById("acorde")?.children[0].remove()
        let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,1)
        document.getElementById("acorde")?.appendChild(newChord)
      } else {
        document.getElementById("acorde")?.children[0].remove()
        let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,this.position)
        document.getElementById("acorde")?.appendChild(newChord)
      }
      
    }
    if(this.pestana.length == 0) {
      if(this.position<2){
        document.getElementById("acorde")?.children[0].remove()
        let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,1)
        document.getElementById("acorde")?.appendChild(newChord)
      } else {
        document.getElementById("acorde")?.children[0].remove()
        let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,this.position)
        document.getElementById("acorde")?.appendChild(newChord)
      }

    }

  }

  setarPosition(){
    let positionAsNumber = parseInt(this.positionInput)
    if(positionAsNumber && positionAsNumber>1 && positionAsNumber<10){
      this.position = positionAsNumber
      document.getElementById("acorde")?.children[0].remove()
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,this.position)
      document.getElementById("acorde")?.appendChild(newChord)
    } 
    if(this.positionInput == ''){
      this.position = 1
      document.getElementById("acorde")?.children[0].remove()
      let newChord = this._generateChordService.SVGchord_gerarAcorde('newchord',this.newChordTitle,this.dots,this.footerToSend,this.pestana,1)
      document.getElementById("acorde")?.appendChild(newChord)
    }    
  }

  getDiagramaBase() {
    let g = this._generateChordService.SVGchord_gerarDiagramaBase_Group(1,'newChord',1)
    let svg = document.createElementNS("http://www.w3.org/2000/svg",'svg')
    svg.setAttribute("width","47.443932mm")
    svg.setAttribute("height",'55.188648mm')
    svg.setAttribute("viewBox",'0 0 47.443932 55.188648')

    svg.appendChild(g)
   

    let teste = this._generateChordService.SVGchord_gerarAcorde('newchord','',[],['O','o','o','o','o','o'],[])
    document.getElementById("acorde")?.appendChild(teste)
  }

  downloadChordAsSVG(){
    let chord = document.getElementById("acorde")?.children[0]
    if(chord){
      let source = new XMLSerializer().serializeToString(chord)
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source)
      let a = document.createElement("a")
      a.download = "customchord.svg"
      a.href = url
      a.click()
    }
  }

  navigate(page:string){
    this.router.navigate([''+page])
  }


  constructor(private _generateChordService: GenerateChordService, private router:Router) { }

  ngOnInit(): void {
    this.getDiagramaBase()
    
  }

  ngAfterViewInit() {
    this.footerSymbolsSelects._results[0].nativeElement[1].selected = true
  }

}
