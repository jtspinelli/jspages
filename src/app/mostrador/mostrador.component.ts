import { Component, OnInit, ViewChild } from '@angular/core';
import { GenerateChordService } from '../generate-chord.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mostrador',
  templateUrl: './mostrador.component.html',
  styleUrls: ['./mostrador.component.css']
})
export class MostradorComponent implements OnInit {

  constructor(private _generateChordsService:GenerateChordService, private router:Router) { }

  chords:any[] = []
  chordsTypes:any[] = []
  loadingChords:boolean = true

  filteredChords:any[] = []
  tagFilterActive:boolean[] = []

  chordsQuantity:number = 0

  errorMessageTitle:string = ''
  errorMessage:string = ''

  @ViewChild("chordsPool") chordsPool:any

  getChords() {
    this._generateChordsService.getChords().then(data => {
      this.chords = data
      //setar array com os tipos de acorde
      let tipos = [... new Set(this.chords.map(e => {if (e.tipo == undefined) {return 'M'}else {
        return e.tipo
      }}))]
      let tiposTitles = [... new Set(this.chords.map(e => e.tipotitle))]
      for(var i = 0; i < tipos.length; i++) {
        this.chordsTypes.push({code: tipos[i], title: tiposTitles[i]})
      }

      this.chordsTypes.forEach(() => {
        this.tagFilterActive.push(false)
      })

      this.printarAcordes()
      
      
    }).catch(err => {
      this.errorMessageTitle = "Erro desconhecido ao buscar acordes no database =/"
      this.errorMessage = "Aguarde uns instantes e tente novamente atualizando a página."
      this.loadingChords = false
    })
  }

  printarAcordes() {
    this.chordsQuantity = this.chords.length
    this.chords.forEach((chord:any) => {
      let SVG = this._generateChordsService.SVGchord_gerarAcorde(false,1,chord.id,chord.title,chord.tipo,chord.dedos,chord.footer,chord.pestana,chord.position)
      document.getElementById("pool")?.appendChild(SVG)
      this.chordsPool.nativeElement.lastChild.classList.add('destacar')
      
    })
    setTimeout(() => {
      this.loadingChords = false
    },2000)
    
  }

  selectedTypes:string[] = []

  filterChords(index:number) {
    let clickedType = this.chordsTypes[index].code

    if(this.tagFilterActive[index] == false) {
      this.tagFilterActive[index] = !this.tagFilterActive[index]
      this.selectedTypes.push(clickedType)

      let svgChords:any[] = this.chordsPool.nativeElement.children
      
      for(var i = 0; i < svgChords.length; i++){
        if(this.selectedTypes.includes(svgChords[i].getAttribute("chord-type")) ){
          svgChords[i].classList.remove("hidden")
        } else {
          svgChords[i].classList.add("hidden")
        }
      }

      let hiddenCount = this.chordsPool.nativeElement.getElementsByClassName("hidden").length
      this.chordsQuantity = this.chords.length - hiddenCount
     

    } else {
      this.tagFilterActive[index] = !this.tagFilterActive[index]
      
      let typeToRemoveIndex = this.selectedTypes.indexOf(clickedType)
      this.selectedTypes.splice(typeToRemoveIndex,1)

      let svgChords:any[] = this.chordsPool.nativeElement.children
      
      for(var i = 0; i < svgChords.length; i++){
        if(this.selectedTypes.includes(svgChords[i].getAttribute("chord-type")) ){
          svgChords[i].classList.remove("hidden")
        } else {
          svgChords[i].classList.add("hidden")
        }
      }

      let hiddenCount = this.chordsPool.nativeElement.getElementsByClassName("hidden").length
      this.chordsQuantity = this.chords.length - hiddenCount


    }

    if(this.selectedTypes.length == 0){
      let svgChords:any[] = this.chordsPool.nativeElement.children      
      for(var i = 0; i < svgChords.length; i++){
        svgChords[i].classList.remove("hidden")      
      }
      this.chordsQuantity = this.chords.length
    }
 
  }

  navigate(page:string){
    this.router.navigate(['/' + page])
  }

  ngOnInit(): void {
    this.getChords()
  }

}
