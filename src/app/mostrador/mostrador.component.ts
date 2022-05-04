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
      this.loadingChords = false
    }).catch(err => {
      this.errorMessageTitle = "Erro desconhecido ao buscar acordes no database =/"
      this.errorMessage = "Aguarde uns instantes e tente novamente atualizando a página."
      this.loadingChords = false
    })
  }

  printarAcordes() {
    this.chordsQuantity = this.chords.length
    this.chords.forEach((chord:any) => {
      let SVG = this._generateChordsService.SVGchord_gerarAcorde(false,1,chord.id,chord.title,chord.dedos,chord.footer,chord.pestana,chord.position)
      document.getElementById("pool")?.appendChild(SVG)
      this.chordsPool.nativeElement.lastChild.classList.add('destacar')
      
    })
  }

  filterChords(index:number) {
    let clickedType = this.chordsTypes[index].code

    if(this.tagFilterActive[index] == false) {
      this.tagFilterActive[index] = !this.tagFilterActive[index]
      let filtro:any[] = []

      if(index > 0) {      
        filtro = this.chords.filter(e => e.tipo == clickedType)
      } else {
        filtro = this.chords.filter(e => !e.tipo)            
      }

      filtro.forEach(item => {
        this.filteredChords.push(item)
      })
      this.chordsQuantity = this.filteredChords.length
    } else {
      this.tagFilterActive[index] = !this.tagFilterActive[index]
      let qtde = 0
      let firstItem
      if(index > 0) {
        qtde = this.filteredChords.filter(e => e.tipo == clickedType).length
        firstItem = this.filteredChords.map(e => e.tipo).indexOf(clickedType)    
        this.filteredChords.splice(firstItem,qtde)
      } else {
        qtde = this.filteredChords.filter(e => !e.tipo).length
        firstItem = this.filteredChords.map(e => e.tipo).indexOf(undefined) 
        this.filteredChords.splice(firstItem,qtde)
      }    
      this.chordsQuantity = this.filteredChords.length  
    }

    if(this.filteredChords.length > 0) {
      this.chordsPool.nativeElement.innerHTML = ''
      this.filteredChords.forEach((chord:any) => {
        let SVG = this._generateChordsService.SVGchord_gerarAcorde(false,1,chord.id,chord.title,chord.dedos,chord.footer,chord.pestana,chord.position)
        document.getElementById("pool")?.appendChild(SVG)
        this.chordsPool.nativeElement.lastChild.classList.add('destacar')
        
      })
    } else {
      this.chordsPool.nativeElement.innerHTML = ''
      this.printarAcordes()
    }    
  }

  navigate(page:string){
    this.router.navigate(['/' + page])
  }

  ngOnInit(): void {
    this.getChords()
  }

}
