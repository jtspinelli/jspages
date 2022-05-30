import { Component, OnInit, ViewChild } from '@angular/core';
import { BuscaAcordeComponent } from '../busca-acorde/busca-acorde.component';
import { GenerateChordService } from '../generate-chord.service';



@Component({
  selector: 'app-chord-chart-gen',
  templateUrl: './chord-chart-gen.component.html',
  styleUrls: ['./chord-chart-gen.component.css']
})
export class ChordChartGenComponent implements OnInit {

  @ViewChild(BuscaAcordeComponent) buscaAcordeComponent:any

  constructor(private _generateChordService: GenerateChordService) { }

  teste(evento:any) {
    let qtde:number = this.buscaAcordeComponent.selecionados.nativeElement.children.length
    let customChord = evento.g
    let customChordId = evento.structure.id

    if(qtde > 1){
      let posicionamento:string = 50/qtde + "%"
      for(var i = 1; i < this.buscaAcordeComponent.selecionados.nativeElement.children.length; i++) {
        this.buscaAcordeComponent.selecionados.nativeElement.children[i].children[1].children[0].setAttribute("x",posicionamento)
      }
    }

    //criar um retângulo para ser uma espécie de 'frame' do acorde ou do elemento <g> dentro do SVG
    let rect = document.createElementNS("http://www.w3.org/2000/svg","rect")

    rect.setAttribute("style","fill-opacity:0;")
    rect.setAttribute("ry",".5")
    rect.setAttribute("height","97%")
    
    rect.setAttribute("y","1") //leve deslocada para baixo

    customChord.appendChild(rect)

    //enviar o acorde para ao chord-chart:
    this.buscaAcordeComponent.selecionados.nativeElement.appendChild(customChord)

    //adicionar o customChord no array de acordes selecionados
    this.buscaAcordeComponent.chordsSelecionados.push(evento.structure)

    //atualizar a quantidade de acordes no GenerateChordService:
    this._generateChordService.qtde = this.buscaAcordeComponent.selecionados.nativeElement.children.length

    //arrumar largura do retângulo (<rect>) de cada acorde
    let width:string = ((100/qtde)-(3/qtde)).toString() + "%"
    for(var i = 1; i < this.buscaAcordeComponent.selecionados.nativeElement.children.length; i++) {
      this.buscaAcordeComponent.selecionados.nativeElement.children[i].children[2].setAttribute("width",width)
    }   

    let conta:number = 0
            
    //CONFIGURAR LARGURA DO SVG:
    if(qtde){
      conta = qtde*47.443932
    }
    
    let equacao:string = (conta + 1).toString() + "mm"
    this.buscaAcordeComponent.selecionados.nativeElement.setAttribute("width",equacao)
    this.buscaAcordeComponent.selecionados.nativeElement.setAttribute("viewBox","0 0 " + conta.toString() + " 55.188648")

    if(parseInt(this.buscaAcordeComponent.inputAcordesPorLinha) > 0) {
      this.buscaAcordeComponent.setSVGchordChart()
    }


    //EVENTO AO CLICAR NO ACORDE RECÉM INSERIDO:
    this.buscaAcordeComponent.selecionados.nativeElement.lastChild.addEventListener("click",() => {
      if(this.buscaAcordeComponent.inputAcordesPorLinha) {
      } else {
        let chordsSelecionados:any[] = this.buscaAcordeComponent.chordsSelecionados
        let index = chordsSelecionados.map(e => e.id).indexOf(customChordId)
        chordsSelecionados.splice(index,1) //remove o acorde clicado do array de selecionados

        this._generateChordService.qtde = this.buscaAcordeComponent.chordsSelecionados.length + 1

        document.getElementById(customChordId)?.remove() //remover o elemento <g> referente ao acorde clicado
        this.buscaAcordeComponent.cleanSearchResults() // limpar input de busca de acorde

        //recolocar acorde no array base (chords) se for acorde do database (se tem propriedade _id)
        if(evento.structure._id){
          this.buscaAcordeComponent.chords.push(evento.structure) //recolocar o acorde no array this.chords (para que possa ser encontrado em nova busca)
        }
        
        this.buscaAcordeComponent.chords.sort((a:any,b:any) => (a.id > b.id) ? 1 : -1) //reclassificar os acordes



        //LIMPAR E RECONSTRUIR O CHART DE ACORDES:
        while(this.buscaAcordeComponent.selecionados.nativeElement.children.length > 1){
          this.buscaAcordeComponent.selecionados.nativeElement.lastChild.remove()
        }
        this.buscaAcordeComponent.montarSVG()



        if(this.buscaAcordeComponent.chordsSelecionados.length > 4 && parseInt(this.buscaAcordeComponent.inputAcordesPorLinha) > 0) {
          this.buscaAcordeComponent.setSVGchordChart()
        }

        if(this.buscaAcordeComponent.chordsSelecionados.length < 5 && parseInt(this.buscaAcordeComponent.inputAcordesPorLinha) > 0) {
          //console.log("EEEEEPA")
          this.buscaAcordeComponent.inputAcordesPorLinha = ''

          //CONFIGURAR ALTURA DO SVG:
          let fatorAltura = 55.188648
          let height = fatorAltura * 1
          let widthW = 47.443932 * 4

          this.buscaAcordeComponent.selecionados.nativeElement.setAttribute("height", height + "mm")

          //CONFIGURAR O VIEWBOX DO SVG
          let viewBox = this.buscaAcordeComponent.selecionados.nativeElement.viewBox
          this.buscaAcordeComponent.selecionados.nativeElement.setAttribute("viewBox", "0 0 " + widthW + " " + height)
          
        }
      }
    })

  }

  color = 'red'

  ngOnInit(): void {
  }


}
