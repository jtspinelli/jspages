import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GenerateChordService } from '../generate-chord.service';
import { DomSanitizer } from '@angular/platform-browser';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-busca-acorde',
  templateUrl: './busca-acorde.component.html',
  styleUrls: ['./busca-acorde.component.css']
})
export class BuscaAcordeComponent implements OnInit {

  @ViewChildren("searchResult") searchResults:any
  @ViewChildren("chordTitleOptions") chordTitleOptions:any
  @ViewChild("selecionados") selecionados:any

  

  url:string = "https://jonathanspinelli.com/_functions/getChords"
  chords:any[] = []
  chordsFiltrados:any[] = []
  chordsSelecionados:any[] = []

  inputAcordesPorLinha = ""

  errorMessageTitle:string = ''
  errorMessage:string = ''

  doneGettingChords:boolean = false

  titleOptions:string[] = []

  searchInput:string = ''

  isHovered:boolean[] = []

  constructor(private router:Router, private http:HttpClient, private _generateChord:GenerateChordService, private domSanitizer:DomSanitizer) { }

  getChords() {
    this.http.get(this.url).toPromise().then((data:any) => {
      this.chords = data.resultado.items.sort((a:any,b:any) => (a.id > b.id) ? 1 : -1)
      this.doneGettingChords = true
    }).catch(err => {
      this.doneGettingChords = true
      this.errorMessageTitle = "Erro desconhecido ao buscar acordes no database =/"
      this.errorMessage = "Aguarde uns instantes e tente novamente atualizando a página."
    })
  }

  setHighlitedOption(evento:any) {
    //metodo chamado no (keydown) do input (assim funciona se a seta pra baixo (40) ou pra cima (38) ficar apertada)

    //SE TECLA PRA BAIXO OU PRA CIMA E HÁ OPÇÕES DE CIFRA (OU TÍTULOS DE ACORDE):
    if((evento.keyCode == 40 || evento.keyCode == 38) && this.titleOptions.length > 0) {

      let lastActive = this.isHovered.indexOf(this.isHovered.filter(e => e == true)[0]) //pegar índice do atualmente 'ativo' ou destacado com a classe de estaque
      let isHoveredIndex = 0


      if(evento.keyCode == 40){
        isHoveredIndex = lastActive + 1
      } else {
        isHoveredIndex = lastActive - 1
      }
      
      this.isHovered = []
      this.isHovered[isHoveredIndex] = true //o array isHovered fica algo como [empty x 3, true] ou [empty x 5, true], etc.

    }
  }

  setTitleOptions(evento:any) {
    //método chamado no (keyup) do input

    //SE NÃO FOR SETA PRA BAIXO OU PRA CIMA:
    if((evento.keyCode !== 40 && evento.keyCode !== 38)) {


      //CONFORME O USUÁRIO DIGITA: (ou: se o input não está vazio mas a tecla apertada NÃO for enter)
      if(evento.target.value !== '' && evento.keyCode !== 13){
        this.titleOptions = [] //esvazia a variável que guarda as opções de nome de acorde/cifra
        this.isHovered = [] //esvazia o array de booleans que marca qual li está destacada
        let listaDeACordes:any[] = Object.assign([],this.chords) //cria uma cópia do array de acordes que veio do database

        //cria uma variável contendo apenas os títulos (ou cifras) dos acordes (.map()), filtra pelos que contém o que está digitado no input (1º .flter()) e depois remove duplicatas (2º .filter())
        let listaFiltrada:any[] = listaDeACordes.map(e => e.title).filter(e => e.includes(evento.target.value)).filter((obj, index, self) => index===self.indexOf(obj)) //segundo filtro remove duplicatas
        
        //para cada item na listaFiltrada
        listaFiltrada.forEach(titleOption => {
          this.titleOptions.push(titleOption) //enviar o item para o array de titleOptions
          this.isHovered.push(false) //enviar um false para o array de li destacada (nenhuma li está destacada por enquanto)
        })
      }

     
      //SE HÁ OPÇÕES DISPONÍVEIS NA LISTA DE CIFRAS (OU TÍTULOS DE ACORDE) E O USUÁRIO APERTAR ***ENTER***:
      if(this.titleOptions.length > 0 && evento.keyCode == 13) {
        
        let options:any[] = this.chordTitleOptions._results //opções que aparecem em lista para escolher
        let titleSelecionado:string = '' //opção escolhida que será enviada para a função de buscar acorde

        //se houver alguma opção destacada (com a classe 'option-link-hover' - opção fica com background destacando):
        if(options.filter(e => e.nativeElement.classList.value.includes("option-link-hover"))[0] !== undefined){
          titleSelecionado = options.filter(e => e.nativeElement.classList.value.includes("option-link-hover"))[0].nativeElement.textContent //variável titleSelecionado será o conteúdo de texto da li que tá com a classe de destaque
          this.searchInput = titleSelecionado //o conteúdo interno do input passa a ser tb o conteúdo em texto da li que ta com a classe de destaque
          this.buscar(titleSelecionado) //chamar função de buscar acorde passando a cifra selecionada

        //se não houver nenhuma opção destacada:  
        } else {
          let temOptionIgualAoInput:boolean = false
          
          for(var i= 0; i < options.length; i++){ //verificar se temos alguma opção que seja exatamente o que tá no input (o que o usuário digitou antes de apertar enter)
            if(options[i].nativeElement.textContent == this.searchInput){ //
              temOptionIgualAoInput = true
              titleSelecionado = options[i].nativeElement.textContent //variável titleSelecionado passa a ser a opçao que corresponde exatamente ao que está escrito no input
            }             
          }

          //se temos opção igual ao que está escrito no input:
          if(temOptionIgualAoInput == true) {
            this.buscar(titleSelecionado)

          //se não temos opção igual ao que está escrito no input  
          } else {
            titleSelecionado = options[0].nativeElement.textContent //titleSelecionado passa a ser a primeira opção da lista
            this.searchInput = options[0].nativeElement.textContent //input é atualizado tb com o mesmo valor
            this.buscar(titleSelecionado)
          }
        }
        
      }

     
      //SE O INPUT ESTIVER VAZIO
      if(evento.target.value == ''){
        this.titleOptions = [] //esvaziar array de opções
        this.isHovered = [] //esvaziar array de li destacada
      } 
    }

  }


  buscar(evento:any) {
    //ESVAZIAR A DIV COM OS RESULTADOS DA BUSCA
    this.searchResults._results[0].nativeElement.innerHTML = "<div id='vejamos'></div>"
  
    //PEGAR ACORDE ENVIADO PELO USUÁRIO
    let buscarPor:any
    if(evento.target) {
      buscarPor = evento.target.textContent
    } else {
      buscarPor = evento
    }

    this.searchInput = buscarPor
    this.titleOptions = []

     if(buscarPor !== ''){

      this.chordsFiltrados = this.chords.filter(e => e.title.toLowerCase() == buscarPor.toLowerCase())
     
      //PARA CADA ACORDE ENCONTRADO:
      this.chordsFiltrados.forEach(chord => {

        if(chord.pestana) { //se tiver info de pestana (último campo obrigatório)

          //CRIAR SVG DO ACORDE USANDO FUNÇÃO DO SERVIÇO GenerateChordService
          let SVGchord = this._generateChord.SVGchord_gerarAcorde(false,1,chord.id,chord.title,chord.dedos,chord.footer,chord.pestana,chord.position)
          document.getElementById("vejamos")?.appendChild(SVGchord) // e jogar para a div com id="vejamos"

          this.searchResults._results[0].nativeElement.children[0].lastChild.classList.add('destacar')

          //AO CLICAR EM UM ACORDE ENCONTRADO: 'SELECIONAR' o acorde (enviar para o Chord Chart)
          document.getElementById("vejamos")?.lastChild?.addEventListener("click",() => {
            
            //colocar o acorde no array de acordes selecionados (para ter um backup dos selecionados)
            this.chordsSelecionados.push(chord)

            //remover dos filtrados E do array base (this.chords) pra não ser encontrado novamente
            document.getElementById(chord.id)?.remove()
            let index:number = this.chords.map(e => e.id).indexOf(chord.id)
            this.chords.splice(index,1) 
            

            let qtde:number = this.selecionados.nativeElement.children.length

            if(qtde > 1){
              let posicionamento:string = 50/qtde + "%"
              for(var i = 1; i < this.selecionados.nativeElement.children.length; i++) {
                this.selecionados.nativeElement.children[i].children[1].children[0].setAttribute("x",posicionamento)
              }
            }
            
            //CRIAR ELEMENTO <g> DO ACORDE PARA COLOCAR DENTRO DO SVG BASE
            let selectedChord = this._generateChord.SVGchord_gerarAcorde(true,qtde,chord.id,chord.title,chord.dedos,chord.footer,chord.pestana,chord.position)
            
            //criar um retângulo para ser uma espécie de 'frame' do acorde ou do elemento <g> dentro do SVG
            let rect = document.createElementNS("http://www.w3.org/2000/svg","rect")
            
            rect.setAttribute("style","fill-opacity:0;")
            rect.setAttribute("ry",".5")
            rect.setAttribute("height","97%")
            
            rect.setAttribute("y","1") //leve deslocada para baixo
            selectedChord.appendChild(rect)

            //enviar acorde selecionado para o chord-chart
            document.getElementById("selecionados")?.appendChild(selectedChord)

            //atualizar a quantidade de acordes na variável do GenerateChordService
            this._generateChord.qtde = this.selecionados.nativeElement.children.length

            //arrumar largura do retângulo (<rect>) de cada acorde
            let width:string = ((100/qtde)-(3/qtde)).toString() + "%"
            for(var i = 1; i < this.selecionados.nativeElement.children.length; i++) {
              this.selecionados.nativeElement.children[i].children[2].setAttribute("width",width)
            }         

           
            let conta:number = 0
            
            //CONFIGURAR LARGURA DO SVG:
            if(qtde){
              conta = qtde*47.443932
            }
            
            let equacao:string = (conta + 1).toString() + "mm"
            document.getElementById("selecionados")?.setAttribute("width",equacao)
            document.getElementById("selecionados")?.setAttribute("viewBox","0 0 " + conta.toString() + " 55.188648")

            if(parseInt(this.inputAcordesPorLinha) > 0) {
              this.setSVGchordChart()
            }


            //AO CLICAR EM UM ACORDE SELECIONADO: REMOVER
            document.getElementById("selecionados")?.lastChild?.addEventListener("click", () => {
              if(this.inputAcordesPorLinha) {
              } else {
                let index = this.chordsSelecionados.map(e => e.id).indexOf(chord.id)
                this.chordsSelecionados.splice(index,1) //remove o acorde clicado do array de selecionados
  
                
                document.getElementById(chord.id)?.remove() //remover o elemento <g> referente ao acorde clicado
                this.cleanSearchResults() // limpar input de busca de acorde

                if(chord._id){
                  this.chords.push(chord) //recolocar o acorde no array this.chords (para que possa ser encontrado em nova busca)
                  this.chords.sort((a:any,b:any) => (a.id > b.id) ? 1 : -1) //reclassificar os acordes
                }

                
                
                this._generateChord.qtde = this.chordsSelecionados.length + 1

                //LIMPAR E RECONSTRUIR O CHART DE ACORDES:
                while(this.selecionados.nativeElement.children.length > 1){
                  this.selecionados.nativeElement.lastChild.remove()
                }
                this.montarSVG()


  
                if(this.chordsSelecionados.length > 4 && parseInt(this.inputAcordesPorLinha) > 0) {
                  this.setSVGchordChart()
                }
  
                if(this.chordsSelecionados.length < 5 && parseInt(this.inputAcordesPorLinha) > 0) {
                  //console.log("EEEEEPA")
                  this.inputAcordesPorLinha = ''
  
                  //CONFIGURAR ALTURA DO SVG:
                  let fatorAltura = 55.188648
                  let height = fatorAltura * 1
                  let widthW = 47.443932 * 4
  
                  this.selecionados.nativeElement.setAttribute("height", height + "mm")
  
                  //CONFIGURAR O VIEWBOX DO SVG
                  let viewBox = this.selecionados.nativeElement.viewBox
                  this.selecionados.nativeElement.setAttribute("viewBox", "0 0 " + widthW + " " + height)
                  
                }
              }




              

              //REORGANIZAR ACORDES QUE SOBRARAM
              /* let restaram = this.selecionados.nativeElement.children.length-1 //contar quantos acordes sobraram
              conta = restaram*47.443932
              let equacao:string = (conta+1).toString() + "mm"
              document.getElementById("selecionados")?.setAttribute("width",equacao)
              document.getElementById("selecionados")?.setAttribute("viewBox","0 0 " + conta.toString() + " 55.188648")
              
              //reconfigurar os retângulos <rect>
              width = ((100/restaram)-(3/restaram)).toString() + "%" 
                  //pra cada um dos agordes restantes:
              for(var i = 1; i < this.selecionados.nativeElement.children.length; i++) {
                //setar a largura do <rect> (mesma pra todos)
                this.selecionados.nativeElement.children[i].children[2].setAttribute("width",width)

                //setar o translate() de cada um:
                let baseValue = 47.443932
                let translateX:string = ((baseValue*i)-baseValue).toString()
                this.selecionados.nativeElement.children[i].setAttribute("transform","translate(" + translateX + ",0)")

                let posicionamento:string = 50/restaram + "%"
                this.selecionados.nativeElement.children[i].children[1].children[0].setAttribute("x",posicionamento)
              } */
            })
          })
        }
      })

    } else {
      this.chordsFiltrados = []
      this.errorMessage = ""
    }

  }

  montarSVG(){
    this.chordsSelecionados.forEach((chord:any) => {
      let qtde:number = this.selecionados.nativeElement.children.length

            if(qtde > 1){
              let posicionamento:string = 50/qtde + "%"
              for(var i = 1; i < this.selecionados.nativeElement.children.length; i++) {
                this.selecionados.nativeElement.children[i].children[1].children[0].setAttribute("x",posicionamento)
              }
            }
            
            //CRIAR ELEMENTO <g> DO ACORDE PARA COLOCAR DENTRO DO SVG BASE
            let selectedChord = this._generateChord.SVGchord_gerarAcorde(true,qtde,chord.id,chord.title,chord.dedos,chord.footer,chord.pestana,chord.position)
            
            //criar um retângulo para ser uma espécie de 'frame' do acorde ou do elemento <g> dentro do SVG
            let rect = document.createElementNS("http://www.w3.org/2000/svg","rect")
            
            rect.setAttribute("style","fill-opacity:0;")
            rect.setAttribute("ry",".5")
            rect.setAttribute("height","97%")
            /* if(qtde == 1) {
              rect.setAttribute("x","1") //leve deslocada para o lado
            } */
            
            rect.setAttribute("y","1") //leve deslocada para baixo
            selectedChord.appendChild(rect)

            
            document.getElementById("selecionados")?.appendChild(selectedChord)

            //arrumar largura do retângulo (<rect>) de cada acorde
            let width:string = ((100/qtde)-(3/qtde)).toString() + "%"
            for(var i = 1; i < this.selecionados.nativeElement.children.length; i++) {
              this.selecionados.nativeElement.children[i].children[2].setAttribute("width",width)
            } 
            


           
            let conta:number = 0
            
            //CONFIGURAR LARGURA DO SVG:
            if(qtde){
              conta = qtde*47.443932
            }
            
            let equacao:string = (conta + 1).toString() + "mm"
            document.getElementById("selecionados")?.setAttribute("width",equacao)
            document.getElementById("selecionados")?.setAttribute("viewBox","0 0 " + conta.toString() + " 55.188648")


            //AO CLICAR EM UM ACORDE SELECIONADO: REMOVER
            document.getElementById("selecionados")?.lastChild?.addEventListener("click", () => {
              let index = this.chordsSelecionados.map(e => e.id).indexOf(chord.id)
              this.chordsSelecionados.splice(index,1)
              
              document.getElementById(chord.id)?.remove() //remover o elemento <g> referente ao acorde clicado
              this.cleanSearchResults() // limpar input de busca de acorde
              if(chord._id){
                this.chords.push(chord) //recolocar o acorde no array this.chords (para que possa ser encontrado em nova busca)
                this.chords.sort((a:any,b:any) => (a.ordenadorMaiores > b.ordenadorMaiores) ? 1 : -1) //reclassificar os acordes
              }
              
              this._generateChord.qtde = this.chordsSelecionados.length + 1

              //LIMPAR E RECONSTRUIR O CHART DE ACORDES:
              while(this.selecionados.nativeElement.children.length > 1){
                this.selecionados.nativeElement.lastChild.remove()
              }
              this.montarSVG()

              if(this.chordsSelecionados.length > 4 && parseInt(this.inputAcordesPorLinha) > 0) {
                this.setSVGchordChart()
              }


              if(this.chordsSelecionados.length < 5 && parseInt(this.inputAcordesPorLinha) > 0) {
                this.inputAcordesPorLinha = ''

                //CONFIGURAR ALTURA DO SVG:
                let fatorAltura = 55.188648
                let height = fatorAltura * 1
                let widthW = 47.443932 * 4

                this.selecionados.nativeElement.setAttribute("height", height + "mm")

                //CONFIGURAR O VIEWBOX DO SVG
                let viewBox = this.selecionados.nativeElement.viewBox
                this.selecionados.nativeElement.setAttribute("viewBox", "0 0 " + widthW + " " + height)
              }

             // this.setSVGchordChart()
/*               //CONFIGURAR ALTURA DO SVG:
              let acordesPorLinha:number = parseInt(this.inputAcordesPorLinha)
              let qtdeDeAcordes = this.chordsSelecionados.length
              let qtdeDeLinhas = Math.ceil(qtdeDeAcordes/acordesPorLinha) 
              console.log("acordes por linha: ", acordesPorLinha)
              console.log("qtde de acordes: ", qtdeDeAcordes)
              console.log("qtde de linhas: ", qtdeDeLinhas)

              let fatorAltura = 55.188648
              let height = qtdeDeLinhas * fatorAltura
              this.selecionados.nativeElement.setAttribute("height", height + "mm")
              
              
              //REORGANIZAR ACORDES QUE SOBRARAM
              let restaram = this.selecionados.nativeElement.children.length-1 //contar quantos acordes sobraram
              conta = restaram*47.443932
              let equacao:string = (conta+1).toString() + "mm"
              document.getElementById("selecionados")?.setAttribute("width",equacao)
              document.getElementById("selecionados")?.setAttribute("viewBox","0 0 " + conta.toString() + " 55.188648")
              
              //reconfigurar os retângulos <rect>
              width = ((100/restaram)-(3/restaram)).toString() + "%" 
                  //pra cada um dos agordes restantes:
              for(var i = 1; i < this.selecionados.nativeElement.children.length; i++) {
                //setar a largura do <rect> (mesma pra todos)
                this.selecionados.nativeElement.children[i].children[2].setAttribute("width",width)

                //setar o translate() de cada um:
                let baseValue = 47.443932
                let translateX:string = ((baseValue*i)-baseValue).toString()
                this.selecionados.nativeElement.children[i].setAttribute("transform","translate(" + translateX + ",0)")

                let posicionamento:string = 50/restaram + "%"
                this.selecionados.nativeElement.children[i].children[1].children[0].setAttribute("x",posicionamento)
              } */
            })
    })
  }


  limpar(index:number) {
    this.isHovered = []
    this.isHovered[index]=true
  }

  cleanSearchResults() {
    this.searchResults._results[0].nativeElement.innerHTML = "<div id='vejamos'></div>"
    this.chordsFiltrados = []
    this.searchInput = ""
  }

  downloadChordChartAsSVG(){
    let source = new XMLSerializer().serializeToString(this.selecionados.nativeElement)
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source)
    let a = document.createElement("a")
    a.download = "acordes.svg"
    a.href = url
    a.click()
  }

  downloadChordChartAsPNG() {
    let div = document.getElementById("selecionados")
    let a = document.createElement("a")
    let uri = ""

    if(div) {
      html2canvas(div).then(canvas => {
        a.download = "imagefile"
        uri = canvas.toDataURL("image/png")
        a.href = uri
        a.click()
      })
    }
   
  }

  setSVGchordChart() {
    //let acordesPorLinha:number = parseInt(evento.target.value)
    let qtdeDeAcordes = this.selecionados.nativeElement.children.length - 1
    let acordesPorLinha:number
    if(this.inputAcordesPorLinha){
      acordesPorLinha = parseInt(this.inputAcordesPorLinha)
    } else {
      acordesPorLinha = qtdeDeAcordes
    }
    
    
    let qtdeDeLinhas = Math.ceil(qtdeDeAcordes/acordesPorLinha) //Math.ceil() arredonda a divisão pro próximo número inteiro
      
   /*  console.log("acordes por linha: ", acordesPorLinha)
    console.log("qtde de acordes: ", qtdeDeAcordes)
    console.log("qtde de linhas: ", qtdeDeLinhas) */

    //REMONTAR O SVG PADRÃO
      //primeiramente, limpar o SVG (remover todos os acordes):
      while(this.selecionados.nativeElement.children.length > 1){
        this.selecionados.nativeElement.lastChild.remove()
      }

      //remontar com todos os acordes presentes no array this.chordsSelecionados
      this.montarSVG()
    //////////////////////////////////////////////////////////////////
    

    //CONFIGURAR LARGURA DO SVG:
    let fator = 47.443932
    let width = (acordesPorLinha * fator)
    this.selecionados.nativeElement.setAttribute("width", (width + 1) + "mm")


    //CONFIGURAR ALTURA DO SVG:
    let fatorAltura = 55.188648
    let height = qtdeDeLinhas * fatorAltura
    if(qtdeDeLinhas > 0) {
     // console.log("QTDE DE LINHAS: ",qtdeDeLinhas)
      this.selecionados.nativeElement.setAttribute("height", height + "mm")

      //CONFIGURAR O VIEWBOX DO SVG
      this.selecionados.nativeElement.setAttribute("viewBox", "0 0 " + width + " " + height)
    } 

    //CONFIGURAR TÍTULOS DOS ACORDES (posicionar no eixo x para centralizar com os diagramas)
    let posicionamento = 50/acordesPorLinha
    for(var i = 1; i < this.selecionados.nativeElement.children.length; i++) {
      this.selecionados.nativeElement.children[i].children[1].children[0].setAttribute("x", posicionamento + "%")
    }

    let acordesNaUltimaLinha = Math.round((qtdeDeAcordes/acordesPorLinha - Math.floor(qtdeDeAcordes/acordesPorLinha)) * acordesPorLinha)  

    //CONFIGURAR POSICIONAMENTO DOS ACORDES
    for(var i = acordesPorLinha+1; i < this.selecionados.nativeElement.children.length; i++) {
      let linhaDoAcorde = Math.ceil(i/acordesPorLinha)
      let translateY = (fatorAltura * linhaDoAcorde) - fatorAltura
      let posicaoDoAcordeNaLinha = i - (acordesPorLinha * (linhaDoAcorde-1))
      let translateX = (fator * posicaoDoAcordeNaLinha) - fator


      //SE ÚLTIMA LINHA TIVER MENOS ACORDES, FAZER TAIS ALTERAÇÕES ***NOS ACORDES DA ÚLTIMA LINHA***:
      if(acordesNaUltimaLinha !== acordesPorLinha && linhaDoAcorde == qtdeDeLinhas){
        
        if(acordesNaUltimaLinha == 1){ //se for acorde da última linha
          let metadeDoWidth = width/2
          translateX = metadeDoWidth - fator/2
        }

        if(acordesNaUltimaLinha == acordesPorLinha-1) {
         translateX = fator*posicaoDoAcordeNaLinha - (fator/2)
        }

        if(acordesNaUltimaLinha == acordesPorLinha/2) {
          if(acordesNaUltimaLinha == 2){
            translateX = fator*posicaoDoAcordeNaLinha
          }
          if(acordesNaUltimaLinha == 3) {
            translateX = translateX + (fator*1.5)
          }
          
        }

        if(acordesNaUltimaLinha == acordesPorLinha/3 && acordesPorLinha !== 3) {
          translateX = translateX + (fator*2)
        }

        if(acordesNaUltimaLinha == acordesPorLinha/2.5){
          translateX = translateX + (fator*1.5)
        }

        if(acordesNaUltimaLinha == acordesPorLinha*3/5 || acordesNaUltimaLinha == acordesPorLinha*2/3){
          if(acordesNaUltimaLinha !==2) {
             translateX = translateX + fator
          }
         
        }

      }
      
      //posicionar o acorde
      this.selecionados.nativeElement.children[i].setAttribute("transform","translate(" + translateX + "," + translateY + ")")
    }

    //CONFIGURAR POSICIONAMENTO DOS RETÂNGULOS VERMELHOS DE CADA ACORDE
    let rectWidth = (100/acordesPorLinha) - (3/acordesPorLinha)
    let rectHeight = (100/qtdeDeLinhas) - (3/qtdeDeLinhas)
    for(var i = 1; i < this.selecionados.nativeElement.children.length; i++) {
      this.selecionados.nativeElement.children[i].children[2].setAttribute("width", rectWidth + "%")
      this.selecionados.nativeElement.children[i].children[2].setAttribute("height", rectHeight + "%")
    }

  }

  setarBase64Font() {
    let fontFamily = this._generateChord.fontFamily
    let avenirBase64 = ''
    
    let style = document.createElementNS("http://www.w3.org/2000/svg","style")
    style.setAttribute("type","text/css")

    let url = "https://jonathanspinelli.com/_functions/AvenirFont"

    this.selecionados.nativeElement.appendChild(style)

   /*  this.http.get(url).toPromise().then((data:any) => {
      avenirBase64 = data.avenirBase64
     // style.innerHTML = "@font-face {font-family:'"+ fontFamily + "'; src:url('" + avenirBase64 + "')}"
     // style.innerHTML = "@font-face {font-family:'Avenir Next LT Pro Editada'; src:url('" + avenirBase64 + "')}"
      this.selecionados.nativeElement.appendChild(style) //enviar a tag <style> pro arquivo SVG
    }) */
  }


  navigate(page:string) {
    this.router.navigate(['/'+page])
  }

  ngOnInit(): void {
    this.getChords()

  }

  ngAfterViewInit() {
   this.setarBase64Font()
  }

}
