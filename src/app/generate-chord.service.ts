import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as opentype from 'opentype.js'

@Injectable({
  providedIn: 'root'
})
export class GenerateChordService {

  constructor(private http:HttpClient) { }

  fontFamily:string = 'Avenir Atelie do Violão Bold'
  fontSize = 6.2
  fontUrl = 'assets/AvenirNextLTProEditada-Bold009.otf'

  qtde = 1

  diagramColor = '#999999' //original: #999999
  dotsColor = '#333333' //original: #333333 (pega os dots e as pestanas)
  footerColor = '#333333' //original: #333333
  positionColor = '#333333' //original: #333333
  titleColor = "#333333" //original: #333333

  pathLabels = ["stroke-linecap", "fill","stroke-linejoin","d","stroke","stroke-width","stroke-opacity","stroke-miterlimit","style"]
  paths = {
    headDireito:["butt","none","miter","M 38.810948,11.395803 42.012161,2.7072697","#000000","0.703037","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-opacity:1"],
    headEsquerdo:["butt","none","miter","M 8.673658,11.400624 5.486248,2.7024467","#000000","1.99464","1","1","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-width:0.702998;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"],
    pestana:["butt","none","miter","m 8.401238,12.111432 h 30.72454","#000000","2.33578","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-opacity:1"],
    pestanaAlt:["butt","none","miter","M 8.8250779,12.928176 H 38.988968","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-opacity:1"],
    traste1:["butt","none","miter","m 8.738838,19.04978 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-opacity:1"],
    traste2:["butt","none","miter","m 8.738838,25.171389 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-opacity:1"],
    traste3:["butt","none","miter","m 8.696118,31.292996 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-opacity:1"],
    traste4:["butt","none","miter","m 8.696118,37.414607 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-opacity:1"],
    traste5:["butt","none","miter","m 8.696118,43.536212 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-opacity:1"],
    corda1:["butt","none","miter","m 38.988968,11.011492 v 36.51","#000000","1.99511","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-width:0.3175;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
    corda2:["butt","none","miter","M 32.935098,11.011497 V 47.521492","#000000","1.99316","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-width:0.423333;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
    corda3:["butt","none","miter","M 26.881218,11.011494 V 47.521492","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-width:0.529167;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
    corda4:["butt","none","miter","M 20.827308,11.011494 V 47.521492","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-width:0.635;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
    corda5:["butt","none","miter","m 14.773428,11.011492 v 36.51","#000000","1.99134","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-width:0.740833;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
    corda6:["butt","none","miter","M 8.7195479,11.011491 V 47.521492","#000000","1.99353","1","4","fill:#808080;fill-opacity:1;stroke:" + this.diagramColor + ";stroke-width:0.846667;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"]
  }

  positionLabels = ["xml:space","style","x","y"]
  positionValues = [
    "preserve",
    "font-size:5.19751px;line-height:1.25;font-family:'" + this.fontFamily + "';text-align:end;text-anchor:end;fill:" + this.positionColor + ";",
    "5.2235003",
    "18.261813"
  ]


  getChords() {
    let url = "https://jonathanspinelli.com/_functions/getChords"
    return this.http.get(url).toPromise().then((data:any) => {
      //return data.resultado.items.sort((a:any,b:any) => (a.ordenadorMaiores > b.ordenadorMaiores) ? 1 : -1)
      return data.resultado.items.sort((a:any,b:any) => (a.id > b.id) ? 1 : -1)
    })
  }

  //FUNÇÃO QUE GERA O DIAGRAMA BASE DOS ACORDES:
  SVGchord_gerarDiagramaBase(id:string,position:number,onlyG:boolean) {
  
    // CRIAR O ELEMENTO SVG:
     let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
     svg1.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink")
     svg1.setAttribute("xmlns","http://www.w3.org/2000/svg")
     svg1.setAttribute("width","47.443932mm")
     svg1.setAttribute("height","55.188648mm") //era originalmente 50...
     svg1.setAttribute("viewBox","0 0 47.443932 55.188648")
     svg1.setAttribute("id",id)
    ////////////////////////////////////////////////////////////////////////////

  
    // CRIAR A CAMADA DO DIAGRAMA BASE:
    let gDiagramaBase = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDiagramaBase.setAttribute("id","DIAGRAMA")  


  
    // CRIAR O GRUPO PARA O HEADSTOCK
    let gDB_Head = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Head.setAttribute("id","head")
  
    //CRIAR O HEADSTOCK
    let headDireito = document.createElementNS("http://www.w3.org/2000/svg","path")
    let headEsquerdo = document.createElementNS("http://www.w3.org/2000/svg","path")
     
  
      
    //CRIAR O GRUPO PARA OS TRASTES
    let gDB_Trastes = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Trastes.setAttribute("id","trastes")
  

    // CRIAR OS TRASTES
    let trastes_pestana = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let trastes_pestanaAlt = document.createElementNS("http://www.w3.org/2000/svg","path")
    let trastes_traste1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let trastes_traste2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let trastes_traste3 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let trastes_traste4 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let trastes_traste5 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let trastes_position = document.createElementNS("http://www.w3.org/2000/svg","text")
    let trastes_positionText = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    ////////////////////////////////////////////////////////////////////////////////////
  
  
  
    //CRIAR O GRUPO PARA AS CORDAS
    let gDB_Cordas = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Cordas.setAttribute("id","cordas")
  

    //CRIAR AS CORDAS
    let corda1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda3 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda4 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda5 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda6 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    /////////////////////////////////////////////////////////////////////////////////// 



    // CRIAR TEXTO DE POSIÇÃO, CASO SEJA INFORMADA (e maior que 1)
    if(position > 1) {      
      for(var i = 0; i<this.positionLabels.length; i++) {
        trastes_position.setAttribute(this.positionLabels[i],this.positionValues[i])
      }
      let positionNumber = position.toString() + "ª"

      trastes_positionText.textContent = positionNumber
      //trastes_position.appendChild(trastes_positionText)
     // gDB_Trastes.appendChild(trastes_position)

     //criar texto de posição como <path>:
     opentype.load(this.fontUrl,(err:any, font:any) => {
       if(err){}else {
         let positionPath = font.getPath(positionNumber,0,18,this.fontSize*0.9)
         let positionPathD = positionPath.toSVG().substring(9,positionPath.toSVG().length-3)

         let positionAsSvgPath = document.createElementNS("http://www.w3.org/2000/svg","path")
         positionAsSvgPath.setAttribute("d",positionPathD)
         positionAsSvgPath.setAttribute("style","fill:#333333;")

         gDB_Trastes.appendChild(positionAsSvgPath)
       }
     })
    }     
  
  
  
    //CRIAR ATRIBUTOS PARA OS PATHS (heads, trastes e cordas)
    for(var i = 0; i < this.pathLabels.length; i++) {
      headDireito.setAttribute(this.pathLabels[i], this.paths.headDireito[i])
      headEsquerdo.setAttribute(this.pathLabels[i], this.paths.headEsquerdo[i])
      trastes_pestana.setAttribute(this.pathLabels[i], this.paths.pestana[i])
      trastes_pestanaAlt.setAttribute(this.pathLabels[i],this.paths.pestanaAlt[i])
      trastes_traste1.setAttribute(this.pathLabels[i], this.paths.traste1[i])
      trastes_traste2.setAttribute(this.pathLabels[i], this.paths.traste2[i])
      trastes_traste3.setAttribute(this.pathLabels[i], this.paths.traste3[i])
      trastes_traste4.setAttribute(this.pathLabels[i], this.paths.traste4[i])
      trastes_traste5.setAttribute(this.pathLabels[i], this.paths.traste5[i])
      corda1.setAttribute(this.pathLabels[i], this.paths.corda1[i])
      corda2.setAttribute(this.pathLabels[i], this.paths.corda2[i])
      corda3.setAttribute(this.pathLabels[i], this.paths.corda3[i])
      corda4.setAttribute(this.pathLabels[i], this.paths.corda4[i])
      corda5.setAttribute(this.pathLabels[i], this.paths.corda5[i])
      corda6.setAttribute(this.pathLabels[i], this.paths.corda6[i])
    }
  
  
    //ADICIONAR ELEMENTOS NOS GRUPOS
    gDB_Trastes.appendChild(trastes_traste1) //colocar os trastes no grupo de trastes
    gDB_Trastes.appendChild(trastes_traste2)
    gDB_Trastes.appendChild(trastes_traste3)
    gDB_Trastes.appendChild(trastes_traste4)
    gDB_Trastes.appendChild(trastes_traste5)
    if(position == 1){ //se for posição 1:
      gDB_Trastes.appendChild(trastes_pestana)  //colocar pestana normal
      gDB_Head.appendChild(headDireito) //e colocar os heads no grupo do headstock
      gDB_Head.appendChild(headEsquerdo)
    } else { //se for posição maior que 1:
      gDB_Trastes.appendChild(trastes_pestanaAlt) //apenas usar a pestana alternativa (deixar o gDB_Head vazio)
    }  
    gDB_Cordas.appendChild(corda1) //colocar as cordas no grupo de cordas
    gDB_Cordas.appendChild(corda2)
    gDB_Cordas.appendChild(corda3)
    gDB_Cordas.appendChild(corda4)
    gDB_Cordas.appendChild(corda5)
    gDB_Cordas.appendChild(corda6)
  
  
    //ADICIONAR GRUPOS NA CAMADA DO DIAGRAMA BASE
    gDiagramaBase.appendChild(gDB_Trastes) // colocar o grupo de trastes na camada do diagrama base
    gDiagramaBase.appendChild(gDB_Head)   // colocar o grupo do headstock na camada do diagrama base
    gDiagramaBase.appendChild(gDB_Cordas) // colocar o grupo de cordas na camada do diagrama base
    /////////////////////////////////////////////////////////////////////////////////////////////////  
    

    if(onlyG == true) {
      return(gDiagramaBase)
    } else {
      svg1.appendChild(gDiagramaBase) // colocar o grupo do diagrama base dentro do svg criado
      return(svg1)
    }
    
      
  }
  
  //FUNÇÃO QUE GERA (RETORNA) O ACORDE EM FORMATO <g> ou <svg>
  SVGchord_gerarAcorde(onlyG:boolean, tamanhoDoChart:number,id:string, title:string, type:string, dedos:number[][], footer:string[],pestanaInstr:number[][], position? :number) {
    let originalTitle = title
    let chord = document.createElementNS("http://www.w3.org/2000/svg", "g")
    chord.setAttribute("id",id)

    let base:SVGElement
    if(position) {
      if(onlyG == true){
        base = this.SVGchord_gerarDiagramaBase(id,position,true)
      } else {
        base = this.SVGchord_gerarDiagramaBase(id,position,false)
        base.setAttribute("chord-type",type)
      }
     
    } else {
      if(onlyG == true) {
        base = this.SVGchord_gerarDiagramaBase(id,1,true)
      } else {
        base = this.SVGchord_gerarDiagramaBase(id,1,false)
        base.setAttribute("chord-type",type)
      }
      
    }
    
  
    let dotLabels = ["style","cx","cy","r"]

    //numeros pra identificar posição (eixo x) de cada corda
    let coordenadasCorda_X = [
      {corda:1, valor:"38.988968"},
      {corda:2, valor:"32.935098"},
      {corda:3, valor:"26.881218"},
      {corda:4, valor:"20.827308"},
      {corda:5, valor:"14.773428"},
      {corda:6, valor:"8.7195479"}
    ]

    //numeros pra identificar posição (eixo y) de cada casa
    let coordenadasCasa_Y = [
      {casa:1, valor:"15.988978"},
      {casa:2, valor:"22.110586"},
      {casa:3, valor:"28.232193"},
      {casa:4, valor:"34.353802"},
      {casa:5, valor:"40.47541"},
    ]

    //GERAR CAMADA DE ACORDE
    let acorde = document.createElementNS("http://www.w3.org/2000/svg","g")
    acorde.setAttribute("id","ACORDE")

    //TITULO
      /* let text = document.createElementNS("http://www.w3.org/2000/svg","text")
      let textLabels = ["xml:space","style","x","y","text-anchor"]
      let posicionamento:string = (50/tamanhoDoChart) + "%"
      let textValues = [
        "preserve",
        "font-size:6.23304px;font-family:'" + fontFamily + "';fill:#333333",
        posicionamento,
        "8.663662",
        "middle"
      ]
    
    for(var i = 0; i<textLabels.length; i++) {
      text.setAttribute(textLabels[i],textValues[i])
    }
    
    let textContent = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    textContent.setAttribute("text-anchor","middle") //alinhar o texto no centro

    let textContentSuperscript = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    let textContentSubscript = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    let textResto = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    textContentSuperscript.setAttribute("style","font-size:80%")
    textContentSuperscript.setAttribute("baseline-shift","60%")
    textContentSubscript.setAttribute("style","font-size:80%")
    textContentSubscript.setAttribute("baseline-shift","-30%")
    textContentSubscript.setAttribute("dx","-0.65em")

    if(title.includes("74")){
      textContent.setAttribute("dy","-0.1em")
      let indexOf7 = title.indexOf("7")
      textResto.textContent = title.substring(indexOf7+2,title.length)
      title = title.substring(0,indexOf7)
      textContentSuperscript.textContent = "7"
      textContentSubscript.textContent = "4"
      textContent.textContent = title
      text.appendChild(textContent)
      text.appendChild(textContentSuperscript)
      text.appendChild(textContentSubscript)
      text.appendChild(textResto)
    } else {
      textContent.textContent = title
      text.appendChild(textContent)
    } */
    
    //acorde.appendChild(text)

  //LOGICA DEDOS

    //GERAR GRUPO DOS DEDOS
    let gDedos = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDedos.setAttribute("id","dedos")
    

    //GERAR OS DOTS E POSICIONAR CONFORME NUMEROS DE CORDA E CASA RECEBIDOS:
      if(dedos && dedos.length > 0){

        dedos.forEach((dedo:number[]) => { //pra cada array de número de corda e casa recebida:
        let cx = coordenadasCorda_X.filter(e => e.corda == dedo[0])[0].valor //procura a coordenada certa conforme a corda informada
        let cy = coordenadasCasa_Y.filter(e => e.casa == dedo[1])[0].valor   //procura a coordenada certa conforme a casa informada
        let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle") //cria um dot (círculo)
        let dotValues = ["fill:"+ this.dotsColor +"; fill-opacity:1; stroke:none",cx,cy,"2.6"] //seta os atributos desse dot
        
          for(var i = 0; i < dotLabels.length; i++) {
            dot.setAttribute(dotLabels[i],dotValues[i]) //coloca os atributos no dot 
          }
          gDedos.appendChild(dot)//envia o dot para o grupo de dedos

        let desenhosNumeros = [
          {numero:1,desenho:" v -3.679837 h -0.800417 l -1.211019,0.888774 0.452183,0.618504 0.686071,-0.530146 v 2.702705 z"},
          {numero:2,desenho:" v -0.758836 h -1.50208 l 0.852392,-0.758836 c 0.337838,-0.301456 0.644491,-0.608109 0.644491,-1.133058 0,-0.769231 -0.654886,-1.127859 -1.330563,-1.127859 -0.717256,0 -1.320167,0.441788 -1.403327,1.185032 l 0.836799,0.114345 c 0.03638,-0.327443 0.22869,-0.556133 0.519751,-0.556133 0.275468,0 0.457381,0.181913 0.457381,0.441788 0,0.223493 -0.119543,0.395011 -0.301456,0.566529 l -1.434513,1.299377 v 0.727651 z"},
          {numero:3,desenho:" c 0,-0.41061 -0.29106,-0.75364 -0.70686,-0.8524 v -0.0156 c 0.35863,-0.0935 0.61851,-0.39501 0.61851,-0.80042 0,-0.70686 -0.64449,-1.0395 -1.294183,-1.0395 -0.613307,0 -1.195428,0.31705 -1.372143,0.93555 l 0.810812,0.18711 c 0.05717,-0.24948 0.254678,-0.4106 0.504158,-0.4106 0.239085,0 0.462576,0.14033 0.462576,0.40541 0,0.35343 -0.317046,0.43659 -0.644489,0.43659 h -0.254678 v 0.63929 h 0.233888 c 0.363826,0 0.748439,0.10915 0.748439,0.48337 0,0.34304 -0.28586,0.46778 -0.535341,0.46778 -0.332641,0 -0.556134,-0.2131 -0.623701,-0.45738 l -0.810812,0.21309 c 0.197506,0.68607 0.805614,0.97714 1.476093,0.97714 0.675681,0 1.387731,-0.36383 1.387731,-1.16944 z"},
          {numero:4,desenho:" v -0.706862 h -0.50935 v -2.255719 h -1.0447 l -1.49689,2.229732 v 0.732849 h 1.73078 v 0.717256 h 0.816 v -0.717256 z m -1.31497,-0.706862 h -0.88877 l 0.87318,-1.361747 h 0.0156 z"}
        ] 

        let coordenadasDedos = [
          {dedo:1, coordenadas:[
            {eixo:"x",coordenadas:[
              {corda:1, valor:"39.688047"},
              {corda:2, valor:"33.634177"},
              {corda:3, valor:"27.580297"},
              {corda:4, valor:"21.526387"},
              {corda:5, valor:"15.472507"},
              {corda:6, valor:"9.418627"}
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"17.828897"},
              {casa:2, valor:"23.950504"},
              {casa:3, valor:"30.072112"},
              {casa:4, valor:"36.193723"},
              {casa:5, valor:"42.315331"}
            ]}
          ]},
          {dedo:2, coordenadas:[
            {eixo:"x",coordenadas:[
              {corda:1, valor:"40.358527"},
              {corda:2, valor:"34.304657"},
              {corda:3, valor:"28.250777"},
              {corda:4, valor:"22.196867"},
              {corda:5, valor:"16.142987"},
              {corda:6, valor:"10.089107"}            
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"17.828897"},
              {casa:2, valor:"23.9505058"},
              {casa:3, valor:"30.072114"},
              {casa:4, valor:"36.193727"},
              {casa:5, valor:"42.315331"}
            ]}
          ]},
          {dedo:3, coordenadas:[
            {eixo:"x", coordenadas:[
              {corda:1, valor:"40.423202"},
              {corda:2, valor:"34.369332"},
              {corda:3, valor:"28.315452"},
              {corda:4, valor:"22.261542"},
              {corda:5, valor:"16.207662"},
              {corda:6, valor:"10.153782"}  
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"16.718914"},
              {casa:2, valor:"22.840523"},
              {casa:3, valor:"28.962131"},
              {casa:4, valor:"35.083744"},
              {casa:5, valor:"41.205348"}
            ]}
          ]},
          {dedo:4, coordenadas:[
            {eixo:"x", coordenadas:[
              {corda:1, valor:"40.524821"},
              {corda:2, valor:"34.470951"},
              {corda:3, valor:"28.417071"},
              {corda:4, valor:"22.363161"},
              {corda:5, valor:"16.309281"},
              {corda:6, valor:"10.255401"}              
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"17.111625"},
              {casa:2, valor:"23.233234"},
              {casa:3, valor:"29.354842"},
              {casa:4, valor:"35.476457"},
              {casa:5, valor:"41.598059"}           
            ]}
          ]}
        ]


          if(dedo[2] && dedo[2] < 5){ // verifica se tem indicação de número de dedo e se o valor informado é menor que 5 (pois só vale dedos 1, 2, 3 e 4)
            let dedoInformado:any = coordenadasDedos.filter(e => e.dedo == dedo[2])[0] // filtrando pelo dedo indicado
            let coordenadasDoDedo_X:any[] = dedoInformado.coordenadas[0].coordenadas //pegando coordenadas do eixo X (corda)
            let coordenadasDoDedo_Y:any[] = dedoInformado.coordenadas[1].coordenadas //pegando coordenadas do eixo Y (casa)
            
            let corda = coordenadasDoDedo_X.filter(e => e.corda == dedo[0])[0].valor
            let casa = coordenadasDoDedo_Y.filter(e => e.casa == dedo[1])[0].valor

            let path = desenhosNumeros.filter(e => e.numero == dedo[2])[0].desenho
            let d = "m " + corda + ", " + casa + path            
            
            
            // let numberLabels = ["d","style","inkscape:label"]
            let numberLabels = ["d","style"]
          //  let numberValues = [d,"fill:#ffffff",dedo[2].toString()]  
            let numberValues = [d,"fill:#ffffff"]  

            let numero = document.createElementNS("http://www.w3.org/2000/svg","path")
            for(var i = 0; i<numberLabels.length; i++) {
              numero.setAttribute(numberLabels[i],numberValues[i])
            }
            gDedos.appendChild(numero)
          }



        })
        
      }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////      
    
    //GERAR GRUPO DO FOOTER (RODAPÉ)
      let gFooter = document.createElementNS("http://www.w3.org/2000/svg", "g")
      gFooter.setAttribute("id","footer")
    
      let pathLabels = ["d","fill-opacity","fill-rule","style"]
      
      if(footer && footer.length == 6){
        
        let footerReverse = Object.assign([],footer) //para não inverter o original
        footerReverse.reverse() //inverte a informação recebida para montar o rodapé (para que a gente possa escrever da 6a pra 1a corda, mas a função trabalha com da 1a a 6a)

        for(var i = 0; i<footerReverse.length; i++) {
          if(footerReverse[i] == "o" || footerReverse[i] == "O"){
            let sign = document.createElementNS("http://www.w3.org/2000/svg","circle")
            let style = ""
            if(footerReverse[i] == "o"){
              style="fill:none;stroke:"+ this.footerColor + ";stroke-width:0.165;" //círculo vazado
            } else {
              style="fill:"+ this.footerColor + ";stroke:"+ this.footerColor + ";stroke-width:0.165;" //círculo cheio (baixo)
            }
            let cx = coordenadasCorda_X.filter(e => e.corda == i+1)[0].valor //determina a corda
            let cy = "50.255634" //valor fixo (base do desenho)
            let r = "2.2690001"
            let label = ""
            if(footerReverse[i] == "o"){
              label = "corda" + (i+1) + "-yes"
            } else {
              label = "corda" + (i+1) + "-bass"
            }
            let signValues = [style,cx,cy,r,label]

            for(var j = 0; j < dotLabels.length; j++) {
              sign.setAttribute(dotLabels[j],signValues[j])
            }
            gFooter.appendChild(sign)
          }

          if(footerReverse[i] == "x") {
            let path = document.createElementNS("http://www.w3.org/2000/svg","path")
            let fatorCorreção = 0.71468
            let coordenadaX = parseFloat(coordenadasCorda_X.filter(e => e.corda == i+1)[0].valor) + fatorCorreção
            let corda = coordenadaX.toString()
            let d = "m " + corda + ",50.255634 1.499305,-1.49793 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14194 l -0.570509,-0.57051 c -0.0193,-0.0193 -0.04548,-0.0303 -0.07166,-0.0303 -0.02755,0 -0.05237,0.011 -0.07166,0.0303 l -1.500684,1.49655 -1.499306,-1.49655 c -0.03858,-0.0386 -0.104729,-0.0386 -0.143316,0 l -0.570505,0.57051 c -0.0193,0.0179 -0.0303,0.0441 -0.0303,0.0703 0,0.0276 0.01101,0.0524 0.0303,0.0717 l 1.499305,1.49793 -1.499305,1.49655 c -0.0193,0.0193 -0.0303,0.0441 -0.0303,0.0717 0,0.0262 0.01101,0.0524 0.0303,0.0717 l 0.570505,0.56913 c 0.02067,0.0207 0.04548,0.0303 0.07166,0.0303 0.02618,0 0.05237,-0.01 0.07166,-0.0303 l 1.499306,-1.49655 1.500684,1.49655 c 0.03996,0.04 0.103354,0.04 0.143316,0 l 0.570509,-0.56913 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14331 z m 0,0"
            let pathLabel = "corda" + (i+1) + "-no"
            let pathValues = [d,"1","nonzero","fill:"+ this.footerColor + ";fill-opacity:1;stroke-width:0.352778",pathLabel]

            for(var j = 0; j<pathLabels.length; j++) {
              path.setAttribute(pathLabels[j],pathValues[j])
            }
            gFooter.appendChild(path)

          }


        }
      }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
  
    //GERAR PESTANA
    pestanaInstr.forEach(pestanaAtual => {
      let pestana = document.createElementNS("http://www.w3.org/2000/svg","path")
      //let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style","inkscape:label"]
      let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style"]

      if(pestana && pestanaAtual.length == 3){

        let cordaInicial = coordenadasCorda_X.filter(e => e.corda == pestanaAtual[0])[0].valor
        let cordaFinal = coordenadasCorda_X.filter(e => e.corda == pestanaAtual[1])[0].valor
        let casa = coordenadasCasa_Y.filter(e => e.casa == pestanaAtual[2])[0].valor
        let d = "M " + cordaInicial + "," + casa + " H " + cordaFinal
        let pestanaValues = ["round","none","miter",d,"5.01731","1","4","stroke:"+this.dotsColor+";"]


        for(var i = 0; i<pestanaLabels.length; i++) {
          pestana.setAttribute(pestanaLabels[i],pestanaValues[i])
        }
        gDedos.appendChild(pestana)
      }
    })
      
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

  
    //colocar o grupo de dedos e o do footer na camada de acordes
    acorde.appendChild(gDedos)
    acorde.appendChild(gFooter)


    if(onlyG == true) {
      chord.appendChild(base)
      chord.appendChild(acorde)
      chord.classList.add("drag-chord")

      let baseValue = 47.443932
      let translateX:string = ((baseValue*tamanhoDoChart)-baseValue).toFixed(6).toString()
      chord.setAttribute("transform","translate(" + translateX + ",0)")


      //GERAR TÍTULO EM FORMATO <path>
      opentype.load(this.fontUrl,(err:any, font:any) => {
        if(err){         
        }else {
          if(originalTitle.includes("74")){ 
            let seteIndex = originalTitle.indexOf("7")
          let quatroIndex = originalTitle.indexOf("4")

          let titlePrefix = originalTitle.substring(0,seteIndex)
          let titleResto = originalTitle.substring(quatroIndex+1,originalTitle.length)      

          let titlePrefixPath = font.getPath(titlePrefix,0,8,this.fontSize)
          let prefixWidth = titlePrefixPath.getBoundingBox().x2 - titlePrefixPath.getBoundingBox().x1


          let setePath = font.getPath("7",prefixWidth+0.5,5,this.fontSize*0.8)
          let quatropath = font.getPath("4",prefixWidth+0.5,9.5,this.fontSize*0.8)
          let titleRestoPath = font.getPath(titleResto,prefixWidth+4,7.5,this.fontSize)


          let titlePrefixPathAsString = titlePrefixPath.toSVG()
          let titlePrefixPathD = titlePrefixPathAsString.substring(9,titlePrefixPathAsString.length-3)

          let setePathD = setePath.toSVG().substring(9,setePath.toSVG().length-3)
          let quatroPathD = quatropath.toSVG().substring(9, quatropath.toSVG().length-3)
          let titleRestoPathD = titleRestoPath.toSVG().substring(9, titleRestoPath.toSVG().length-3)

          let g = document.createElementNS("http://www.w3.org/2000/svg","g")
          g.setAttribute("id","título")

          let titleAsSvgPath = document.createElementNS("http://www.w3.org/2000/svg","path")
          titleAsSvgPath.setAttribute("d",titlePrefixPathD+setePathD+quatroPathD+titleRestoPathD)

          
          let restoWidth = titleRestoPath.getBoundingBox().x2 - titleRestoPath.getBoundingBox().x1
          let titleAsSvgPathWidth = prefixWidth + restoWidth + 4

          titleAsSvgPath.setAttribute("style","fill:" + this.titleColor + ";")
          titleAsSvgPath.setAttribute("transform","translate("+ (23.5-(titleAsSvgPathWidth/2)) + ",0)")

          g.appendChild(titleAsSvgPath)

          chord.children[1].insertBefore(g,chord.children[1].firstChild)
          } else {
            let path = font.getPath(originalTitle,0,8.5,this.fontSize)
            let pathWidth = path.getBoundingBox().x2 - path.getBoundingBox().x1
            let pathElementAsString = path.toSVG()
            let pathD = pathElementAsString.substring(9,pathElementAsString.length-3)

            let g = document.createElementNS("http://www.w3.org/2000/svg","g")
            g.setAttribute("id","título")
            let svgPath = document.createElementNS("http://www.w3.org/2000/svg","path")
            svgPath.setAttribute("d",pathD)
            svgPath.setAttribute("style","fill:" + this.titleColor + ";")
            svgPath.setAttribute("transform","translate("+ (23.5-(pathWidth/2)) + ",0)")

            g.appendChild(svgPath)
            chord.children[1].insertBefore(g,chord.children[1].firstChild)
            
          }
        }
      })

      return(chord)

    } else {
      base.appendChild(acorde)

      //GERAR TÍTULO EM FORMATO <path>
      opentype.load(this.fontUrl,(err:any, font:any) => {
        if(err){         
        }else {
          if(originalTitle.includes("74")){ 
            let seteIndex = originalTitle.indexOf("7")
            let quatroIndex = originalTitle.indexOf("4")

            let titlePrefix = originalTitle.substring(0,seteIndex)
            let titleResto = originalTitle.substring(quatroIndex+1,originalTitle.length)

            let titlePrefixPath = font.getPath(titlePrefix,0,8,this.fontSize)
            let prefixWidth = titlePrefixPath.getBoundingBox().x2 - titlePrefixPath.getBoundingBox().x1


            let setePath = font.getPath("7",prefixWidth+0.5,5,this.fontSize*0.8)
            let quatropath = font.getPath("4",prefixWidth+0.5,9.5,this.fontSize*0.8)
            let titleRestoPath = font.getPath(titleResto,prefixWidth+4,7.5,this.fontSize)


            let titlePrefixPathAsString = titlePrefixPath.toSVG()
            let titlePrefixPathD = titlePrefixPathAsString.substring(9,titlePrefixPathAsString.length-3)

            let setePathD = setePath.toSVG().substring(9,setePath.toSVG().length-3)
            let quatroPathD = quatropath.toSVG().substring(9, quatropath.toSVG().length-3)
            let titleRestoPathD = titleRestoPath.toSVG().substring(9, titleRestoPath.toSVG().length-3)

            let g = document.createElementNS("http://www.w3.org/2000/svg","g")
            g.setAttribute("id","título")

            let titleAsSvgPath = document.createElementNS("http://www.w3.org/2000/svg","path")
            titleAsSvgPath.setAttribute("d",titlePrefixPathD+setePathD+quatroPathD+titleRestoPathD)

            
            let restoWidth = titleRestoPath.getBoundingBox().x2 - titleRestoPath.getBoundingBox().x1
            let titleAsSvgPathWidth = prefixWidth + restoWidth + 4

            titleAsSvgPath.setAttribute("style","fill:" + this.titleColor + ";")
            titleAsSvgPath.setAttribute("transform","translate("+ (23.5-(titleAsSvgPathWidth/2)) + ",0)")

            g.appendChild(titleAsSvgPath)

            base.children[1].insertBefore(g,base.children[1].firstChild)
          } else {
            let path = font.getPath(originalTitle,0,8.5,this.fontSize)
            let pathWidth = path.getBoundingBox().x2 - path.getBoundingBox().x1
            let pathElementAsString = path.toSVG()
            let pathD = pathElementAsString.substring(9,pathElementAsString.length-3)

            let g = document.createElementNS("http://www.w3.org/2000/svg","g")
            g.setAttribute("id","título")
            let svgPath = document.createElementNS("http://www.w3.org/2000/svg","path")
            svgPath.setAttribute("d",pathD)
            svgPath.setAttribute("style","fill:" + this.titleColor + ";")
            svgPath.setAttribute("transform","translate("+ (23.5-(pathWidth/2)) + ",0)")

            g.appendChild(svgPath)
            base.children[1].insertBefore(g,base.children[1].firstChild)
            
          }
        }
      })
      return(base)
    }

    
    
  }    

}