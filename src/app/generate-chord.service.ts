import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenerateChordService {

  constructor(private http:HttpClient) { }

  fontFamily:string = 'Avenir Atelie do Violão Bold'

  qtde = 1


  getChords() {
    let url = "https://jonathanspinelli.com/_functions/getChords"
    return this.http.get(url).toPromise().then((data:any) => {
      //return data.resultado.items.sort((a:any,b:any) => (a.ordenadorMaiores > b.ordenadorMaiores) ? 1 : -1)
      return data.resultado.items.sort((a:any,b:any) => (a.id > b.id) ? 1 : -1)
    })
  }

  //FUNÇÕES QUE GERAM ACORDE EM FORMATO <svg>
  SVGchord_gerarDiagramaBase(id:string,position:number) {

    let fontFamily = "Avenir Atelie do Violão Bold" //aplicada só à indicação de posição

    let pathLabels = ["stroke-linecap", "fill","stroke-linejoin","d","stroke","stroke-width","stroke-opacity","stroke-miterlimit","style"] 
    let paths = {
       headDireito:["butt","none","miter","M 38.810948,11.395803 42.012161,2.7072697","#000000","0.703037","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       headEsquerdo:["butt","none","miter","M 8.673658,11.400624 5.486248,2.7024467","#000000","1.99464","1","1","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.702998;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"],
       pestana:["butt","none","miter","m 8.401238,12.111432 h 30.72454","#000000","2.33578","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       pestanaAlt:["butt","none","miter","M 8.8250779,12.928176 H 38.988968","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste1:["butt","none","miter","m 8.738838,19.04978 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste2:["butt","none","miter","m 8.738838,25.171389 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste3:["butt","none","miter","m 8.696118,31.292996 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste4:["butt","none","miter","m 8.696118,37.414607 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste5:["butt","none","miter","m 8.696118,43.536212 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       corda1:["butt","none","miter","m 38.988968,11.011492 v 36.51","#000000","1.99511","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.3175;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda2:["butt","none","miter","M 32.935098,11.011497 V 47.521492","#000000","1.99316","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.423333;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda3:["butt","none","miter","M 26.881218,11.011494 V 47.521492","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.529167;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda4:["butt","none","miter","M 20.827308,11.011494 V 47.521492","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.635;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda5:["butt","none","miter","m 14.773428,11.011492 v 36.51","#000000","1.99134","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.740833;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda6:["butt","none","miter","M 8.7195479,11.011491 V 47.521492","#000000","1.99353","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.846667;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"]
     }
  
    // CRIAR O ELEMENTO SVG:
     let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
     svg1.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink")
     svg1.setAttribute("xmlns","http://www.w3.org/2000/svg")
     svg1.setAttribute("width","47.443932mm")
     svg1.setAttribute("height","55.188648mm") //era originalmente 50...
     svg1.setAttribute("viewBox","0 0 47.443932 55.188648")
     svg1.setAttribute("id",id)
    // svg1.classList.add("destacar")
    ////////////////////////////////////////////////////////////////////////////


    //CRIAR TAG DE ESTILO COM INFORMAÇÃO DA FONTE PERSONALIZADA
      let style = document.createElementNS("http://www.w3.org/2000/svg","style")
      style.setAttribute("type","text/css")

      let avenirBase64 = ''

      //fazer um getRequest pra pegar a fonte em base64 do backend do site jonathanspinelli.com no Wix:
      let url = "https://jonathanspinelli.com/_functions/AvenirFont"
      this.http.get(url).toPromise().then((data:any) => {
        avenirBase64 = data.avenirBase64
        style.innerHTML = "@font-face {font-family:'Avenir Atelie do Violão Bold'; src:url('" + avenirBase64 + "')}"
        svg1.appendChild(style) //enviar a tag <style> pro arquivo SVG
      })
    /////////////////////////////////////////////////////////////////////
  

  
    // CRIAR A CAMADA DO DIAGRAMA BASE:
     let gDiagramaBase = document.createElementNS("http://www.w3.org/2000/svg", "g")
     gDiagramaBase.setAttribute("id","DIAGRAMA")
     //gDiagramaBase.setAttribute("inkscape:groupmode","layer")
     //gDiagramaBase.setAttribute("inkscape:label","DIAGRAMA")
    ///////////////////////////////////////////////////////////////////////////// 
  
  
  
  
    // CRIAR O GRUPO PARA O HEADSTOCK
     let gDB_Head = document.createElementNS("http://www.w3.org/2000/svg", "g")
     gDB_Head.setAttribute("id","head")
    // gDB_Head.setAttribute("inkscape:label","head")
    /////////////////////////////////////////////////////////////////////////////
  
    /* CRIAR O HEADSTOCK  */
     let headDireito = document.createElementNS("http://www.w3.org/2000/svg","path")
     let headEsquerdo = document.createElementNS("http://www.w3.org/2000/svg","path")
     ////////////////
  
  
  
  
  
    // CRIAR O GRUPO PARA OS TRASTES
    let gDB_Trastes = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Trastes.setAttribute("id","trastes")
   // gDB_Trastes.setAttribute("inkscape:label","trastes")
    /////////////////////////////////////////////////////////////////////////////
  
    /* CRIAR OS TRASTES */
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
  
  
  
  
    // CRIAR O GRUPO PARA AS CORDAS
    let gDB_Cordas = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Cordas.setAttribute("id","cordas")
   // gDB_Cordas.setAttribute("inkscape:label","cordas")
    /////////////////////////////////////////////////////////////////////////////
  
    /* CRIAR AS CORDAS */
    let corda1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda3 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda4 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda5 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda6 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    ///////////////////////////////////////////////////////////////////////////////////
  
    // CRIAR TEXTO DE POSIÇÃO, CASO SEJA INFORMADA
    if(position > 1) {
      let positionLabels = ["xml:space","style","x","y"]
      let positionValues = [
        "preserve",
        "font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:5.19751px;line-height:1.25;font-family:'" + fontFamily + "';-inkscape-font-specification:'Avenir Next LT Pro, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;text-anchor:end;fill:#000000;stroke-width:0.182553",
        "5.2235003",
        "18.261813"
      ]
      for(var i = 0; i<positionLabels.length; i++) {
        trastes_position.setAttribute(positionLabels[i],positionValues[i])
      }
      let positionNumber = position.toString() + "ª"
      trastes_positionText.textContent = positionNumber
      trastes_position.appendChild(trastes_positionText)
      gDB_Trastes.appendChild(trastes_position)
    }
    
  
  
  
  
    //CRIAR ATRIBUTOS PARA OS PATHS (heads, trastes e cordas)
    for(var i = 0; i < pathLabels.length; i++) {
      headDireito.setAttribute(pathLabels[i], paths.headDireito[i])
      headEsquerdo.setAttribute(pathLabels[i], paths.headEsquerdo[i])
      trastes_pestana.setAttribute(pathLabels[i], paths.pestana[i])
      trastes_pestanaAlt.setAttribute(pathLabels[i],paths.pestanaAlt[i])
      trastes_traste1.setAttribute(pathLabels[i], paths.traste1[i])
      trastes_traste2.setAttribute(pathLabels[i], paths.traste2[i])
      trastes_traste3.setAttribute(pathLabels[i], paths.traste3[i])
      trastes_traste4.setAttribute(pathLabels[i], paths.traste4[i])
      trastes_traste5.setAttribute(pathLabels[i], paths.traste5[i])
      corda1.setAttribute(pathLabels[i], paths.corda1[i])
      corda2.setAttribute(pathLabels[i], paths.corda2[i])
      corda3.setAttribute(pathLabels[i], paths.corda3[i])
      corda4.setAttribute(pathLabels[i], paths.corda4[i])
      corda5.setAttribute(pathLabels[i], paths.corda5[i])
      corda6.setAttribute(pathLabels[i], paths.corda6[i])
    }
  
  
    //ADICIONAR ELEMENTOS NOS GRUPOS
    gDB_Trastes.appendChild(trastes_traste1) //colocar os trastes no grupo de trastes
    gDB_Trastes.appendChild(trastes_traste2)
    gDB_Trastes.appendChild(trastes_traste3)
    gDB_Trastes.appendChild(trastes_traste4)
    gDB_Trastes.appendChild(trastes_traste5)
    if(position == 1){
      gDB_Trastes.appendChild(trastes_pestana) 
      gDB_Head.appendChild(headDireito) //colocar os heads no grupo do headstock
      gDB_Head.appendChild(headEsquerdo)
    } else {
      gDB_Trastes.appendChild(trastes_pestanaAlt) 
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
  
  
     svg1.appendChild(gDiagramaBase) // colocar o grupo do diagrama base dentro do svg criado
     //document.getElementById("vejamos")?.appendChild(svg1)
     return(svg1)
      
  }

  SVGchord_gerarAcorde(id:string, title:string, dedos:number[][], footer:string[],pestanaInstr:number[], position? :number) {
  
    let fontFamily = "Avenir Atelie do Violão Bold"
    
    let base
    if(position) {
      base = this.SVGchord_gerarDiagramaBase(id,position)
    } else {
      base = this.SVGchord_gerarDiagramaBase(id,1)
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
      let text = document.createElementNS("http://www.w3.org/2000/svg","text")
      let textLabels = ["xml:space","style","x","y","text-anchor"]

      let textValues = [
        "preserve",
        "font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:6.23304px;line-height:1.25;font-family:'" + fontFamily + "';-inkscape-font-specification:'Avenir Next LT Pro, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;text-anchor:end;fill:#333333;stroke-width:0.264583",
        "50%",
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
    textContentSuperscript.setAttribute("style","font-size:80%")
    textContentSuperscript.setAttribute("baseline-shift","60%")
    textContentSubscript.setAttribute("style","font-size:80%")
    textContentSubscript.setAttribute("baseline-shift","-30%")
    textContentSubscript.setAttribute("dx","-0.65em")

    if(title.slice(-2) == "74"){
      textContent.setAttribute("dy","-0.1em")
      let indexOf7 = title.indexOf("7")
      title = title.substring(0,indexOf7)
      textContentSuperscript.textContent = "7"
      textContentSubscript.textContent = "4"
      textContent.textContent = title
      text.appendChild(textContent)
      text.appendChild(textContentSuperscript)
      text.appendChild(textContentSubscript)
    } else {
      textContent.textContent = title
      text.appendChild(textContent)
    }
    

    
    acorde.appendChild(text)

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
        let dotValues = ["fill:#333333; fill-opacity:1; stroke:none",cx,cy,"2.6"] //seta os atributos desse dot
        
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
              style="fill:none;stroke:#333333;stroke-width:0.165;" //círculo vazado
            } else {
              style="fill:#333333;stroke:#333333;stroke-width:0.165;" //círculo cheio (baixo)
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
            let pathValues = [d,"1","nonzero","fill:#333333;fill-opacity:1;stroke-width:0.352778",pathLabel]

            for(var j = 0; j<pathLabels.length; j++) {
              path.setAttribute(pathLabels[j],pathValues[j])
            }
            gFooter.appendChild(path)

          }


        }
      }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
  
    //GERAR PESTANA
      let pestana = document.createElementNS("http://www.w3.org/2000/svg","path")
      //let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style","inkscape:label"]
      let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style"]

      if(pestana && pestanaInstr.length == 3){

        let cordaInicial = coordenadasCorda_X.filter(e => e.corda == pestanaInstr[0])[0].valor
        let cordaFinal = coordenadasCorda_X.filter(e => e.corda == pestanaInstr[1])[0].valor
        let casa = coordenadasCasa_Y.filter(e => e.casa == pestanaInstr[2])[0].valor
        let d = "M " + cordaInicial + "," + casa + " H " + cordaFinal
        let pestanaValues = ["round","none","miter",d,"5.01731","1","4","stroke:#333333"]


        for(var i = 0; i<pestanaLabels.length; i++) {
          pestana.setAttribute(pestanaLabels[i],pestanaValues[i])
        }
        gDedos.appendChild(pestana)
      }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

  
    //colocar o grupo de dedos e o do footer na camada de acordes
    acorde.appendChild(gDedos)
    acorde.appendChild(gFooter)

    //colocar a camada de acordes no arquivo SVG
    base.appendChild(acorde)

    //colocar o arquivo SVG na página
    // document.getElementById("vejamos")?.appendChild(base)
    //console.log(base)
    return(base)
    
  }  
  ////////////////////////////////////////////////////////////


  //FUNÇÕES QUE GERAM ACORDE EM FORMATO <g> PARA SEREM INCOPORADO EM UM SVG (<svg>) BASE
  SVGchord_gerarDiagramaBase_Group(tamanhoDoChart:number,id:string,position:number) {

    //let fontFamily = "Avenir Atelie do Violão Bold" //aplicada só à indicação de posição
    //let fontFamily = "Avenir Next LT Pro Editada"
    let fontFamily = this.fontFamily

    let pathLabels = ["stroke-linecap", "fill","stroke-linejoin","d","stroke","stroke-width","stroke-opacity","stroke-miterlimit","style"] 
    let paths = {
       headDireito:["butt","none","miter","M 38.810948,11.395803 42.012161,2.7072697","#000000","0.703037","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       headEsquerdo:["butt","none","miter","M 8.673658,11.400624 5.486248,2.7024467","#000000","1.99464","1","1","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.702998;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"],
       pestana:["butt","none","miter","m 8.401238,12.111432 h 30.72454","#000000","2.33578","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       pestanaAlt:["butt","none","miter","M 8.8250779,12.928176 H 38.988968","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste1:["butt","none","miter","m 8.738838,19.04978 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste2:["butt","none","miter","m 8.738838,25.171389 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste3:["butt","none","miter","m 8.696118,31.292996 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste4:["butt","none","miter","m 8.696118,37.414607 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste5:["butt","none","miter","m 8.696118,43.536212 h 30.16389","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       corda1:["butt","none","miter","m 38.988968,11.011492 v 36.51","#000000","1.99511","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.3175;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda2:["butt","none","miter","M 32.935098,11.011497 V 47.521492","#000000","1.99316","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.423333;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda3:["butt","none","miter","M 26.881218,11.011494 V 47.521492","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.529167;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda4:["butt","none","miter","M 20.827308,11.011494 V 47.521492","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.635;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda5:["butt","none","miter","m 14.773428,11.011492 v 36.51","#000000","1.99134","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.740833;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda6:["butt","none","miter","M 8.7195479,11.011491 V 47.521492","#000000","1.99353","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.846667;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"]
     }
  

    //CRIAR TAG DE ESTILO COM INFORMAÇÃO DA FONTE PERSONALIZADA
      let style = document.createElementNS("http://www.w3.org/2000/svg","style")
      style.setAttribute("type","text/css")



  
    // CRIAR A CAMADA DO DIAGRAMA BASE:
     let gDiagramaBase = document.createElementNS("http://www.w3.org/2000/svg", "g")
     gDiagramaBase.setAttribute("id","DIAGRAMA")
     //gDiagramaBase.setAttribute("inkscape:groupmode","layer")
     //gDiagramaBase.setAttribute("inkscape:label","DIAGRAMA")
    ///////////////////////////////////////////////////////////////////////////// 
  
  
  
  
    // CRIAR O GRUPO PARA O HEADSTOCK
     let gDB_Head = document.createElementNS("http://www.w3.org/2000/svg", "g")
     gDB_Head.setAttribute("id","head")
    // gDB_Head.setAttribute("inkscape:label","head")
    /////////////////////////////////////////////////////////////////////////////
  
    /* CRIAR O HEADSTOCK  */
     let headDireito = document.createElementNS("http://www.w3.org/2000/svg","path")
     let headEsquerdo = document.createElementNS("http://www.w3.org/2000/svg","path")
     ////////////////
  
  
  
  
  
    // CRIAR O GRUPO PARA OS TRASTES
    let gDB_Trastes = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Trastes.setAttribute("id","trastes")
   // gDB_Trastes.setAttribute("inkscape:label","trastes")
    /////////////////////////////////////////////////////////////////////////////
  
    /* CRIAR OS TRASTES */
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
  
  
  
  
    // CRIAR O GRUPO PARA AS CORDAS
    let gDB_Cordas = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Cordas.setAttribute("id","cordas")
   // gDB_Cordas.setAttribute("inkscape:label","cordas")
    /////////////////////////////////////////////////////////////////////////////
  
    /* CRIAR AS CORDAS */
    let corda1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda3 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda4 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda5 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda6 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    ///////////////////////////////////////////////////////////////////////////////////
  
    // CRIAR TEXTO DE POSIÇÃO, CASO SEJA INFORMADA
    if(position > 1) {
      let positionLabels = ["xml:space","style","x","y"]
      let positionValues = [
        "preserve",
        "font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:5.19751px;line-height:1.25;font-family:'" + fontFamily + "';-inkscape-font-specification:'Avenir Next LT Pro, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;text-anchor:end;fill:#000000;stroke-width:0.182553",
        "5.2235003",
        "18.261813"
      ]
      for(var i = 0; i<positionLabels.length; i++) {
        trastes_position.setAttribute(positionLabels[i],positionValues[i])
      }
      let positionNumber = position.toString() + "ª"
      trastes_positionText.textContent = positionNumber
      trastes_position.appendChild(trastes_positionText)
      gDB_Trastes.appendChild(trastes_position)
    }
    
  
  
  
  
    //CRIAR ATRIBUTOS PARA OS PATHS (heads, trastes e cordas)
    for(var i = 0; i < pathLabels.length; i++) {
      headDireito.setAttribute(pathLabels[i], paths.headDireito[i])
      headEsquerdo.setAttribute(pathLabels[i], paths.headEsquerdo[i])
      trastes_pestana.setAttribute(pathLabels[i], paths.pestana[i])
      trastes_pestanaAlt.setAttribute(pathLabels[i],paths.pestanaAlt[i])
      trastes_traste1.setAttribute(pathLabels[i], paths.traste1[i])
      trastes_traste2.setAttribute(pathLabels[i], paths.traste2[i])
      trastes_traste3.setAttribute(pathLabels[i], paths.traste3[i])
      trastes_traste4.setAttribute(pathLabels[i], paths.traste4[i])
      trastes_traste5.setAttribute(pathLabels[i], paths.traste5[i])
      corda1.setAttribute(pathLabels[i], paths.corda1[i])
      corda2.setAttribute(pathLabels[i], paths.corda2[i])
      corda3.setAttribute(pathLabels[i], paths.corda3[i])
      corda4.setAttribute(pathLabels[i], paths.corda4[i])
      corda5.setAttribute(pathLabels[i], paths.corda5[i])
      corda6.setAttribute(pathLabels[i], paths.corda6[i])
    }
  
  
    //ADICIONAR ELEMENTOS NOS GRUPOS
    gDB_Trastes.appendChild(trastes_traste1) //colocar os trastes no grupo de trastes
    gDB_Trastes.appendChild(trastes_traste2)
    gDB_Trastes.appendChild(trastes_traste3)
    gDB_Trastes.appendChild(trastes_traste4)
    gDB_Trastes.appendChild(trastes_traste5)
    if(position == 1){
      gDB_Trastes.appendChild(trastes_pestana) 
      gDB_Head.appendChild(headDireito) //colocar os heads no grupo do headstock
      gDB_Head.appendChild(headEsquerdo)
    } else {
      gDB_Trastes.appendChild(trastes_pestanaAlt) 
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
  
  
     //svg1.appendChild(gDiagramaBase) // colocar o grupo do diagrama base dentro do svg criado
     //document.getElementById("vejamos")?.appendChild(svg1)
     return(gDiagramaBase)
      
  }

  SVGchord_gerarAcorde_Group(tamanhoDoChart:number,id:string, title:string, dedos:number[][], footer:string[],pestanaInstr:number[], position? :number) {
  
    let chord = document.createElementNS("http://www.w3.org/2000/svg", "g")
    chord.setAttribute("id",id)

    //let fontFamily = "Avenir Atelie do Violão Bold"
    //let fontFamily = "Avenir Next LT Pro Editada"
    let fontFamily = this.fontFamily
    let base
    if(position) {
      base = this.SVGchord_gerarDiagramaBase_Group(tamanhoDoChart,id,position)
    } else {
      base = this.SVGchord_gerarDiagramaBase_Group(tamanhoDoChart,id,1)
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
      let text = document.createElementNS("http://www.w3.org/2000/svg","text")
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
    textContentSuperscript.setAttribute("style","font-size:80%")
    textContentSuperscript.setAttribute("baseline-shift","60%")
    textContentSubscript.setAttribute("style","font-size:80%")
    textContentSubscript.setAttribute("baseline-shift","-30%")
    textContentSubscript.setAttribute("dx","-0.65em")

    if(title.slice(-2) == "74"){
      textContent.setAttribute("dy","-0.1em")
      let indexOf7 = title.indexOf("7")
      title = title.substring(0,indexOf7)
      textContentSuperscript.textContent = "7"
      textContentSubscript.textContent = "4"
      textContent.textContent = title
      text.appendChild(textContent)
      text.appendChild(textContentSuperscript)
      text.appendChild(textContentSubscript)
    } else {
      textContent.textContent = title
      text.appendChild(textContent)
    }
    

    
    acorde.appendChild(text)

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
        let dotValues = ["fill:#333333; fill-opacity:1; stroke:none",cx,cy,"2.6"] //seta os atributos desse dot
        
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
              style="fill:none;stroke:#333333;stroke-width:0.165;" //círculo vazado
            } else {
              style="fill:#333333;stroke:#333333;stroke-width:0.165;" //círculo cheio (baixo)
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
            let pathValues = [d,"1","nonzero","fill:#333333;fill-opacity:1;stroke-width:0.352778",pathLabel]

            for(var j = 0; j<pathLabels.length; j++) {
              path.setAttribute(pathLabels[j],pathValues[j])
            }
            gFooter.appendChild(path)

          }


        }
      }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
  
    //GERAR PESTANA
      let pestana = document.createElementNS("http://www.w3.org/2000/svg","path")
      //let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style","inkscape:label"]
      let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style"]

      if(pestana && pestanaInstr.length == 3){

        let cordaInicial = coordenadasCorda_X.filter(e => e.corda == pestanaInstr[0])[0].valor
        let cordaFinal = coordenadasCorda_X.filter(e => e.corda == pestanaInstr[1])[0].valor
        let casa = coordenadasCasa_Y.filter(e => e.casa == pestanaInstr[2])[0].valor
        let d = "M " + cordaInicial + "," + casa + " H " + cordaFinal
        let pestanaValues = ["round","none","miter",d,"5.01731","1","4","stroke:#333333"]


        for(var i = 0; i<pestanaLabels.length; i++) {
          pestana.setAttribute(pestanaLabels[i],pestanaValues[i])
        }
        gDedos.appendChild(pestana)
      }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

  
    //colocar o grupo de dedos e o do footer na camada de acordes
    acorde.appendChild(gDedos)
    acorde.appendChild(gFooter)

    chord.appendChild(base)
    chord.appendChild(acorde)

    //colocar a camada de acordes no arquivo SVG
   // base.appendChild(acorde)

    //colocar o arquivo SVG na página
    // document.getElementById("vejamos")?.appendChild(base)
    //console.log(base)

    let baseValue = 47.443932
    let translateX:string = ((baseValue*tamanhoDoChart)-baseValue).toString()
    chord.setAttribute("transform","translate(" + translateX + ",0)")


    return(chord)
    
  }  

  SVGchord_gerarAcorde_Group_aceitaPestanaS(tamanhoDoChart:number,id:string, title:string, dedos:number[][], footer:string[],pestanaInstr:number[][], position? :number) {
  
    let chord = document.createElementNS("http://www.w3.org/2000/svg", "g")
    chord.setAttribute("id",id)

    //let fontFamily = "Avenir Atelie do Violão Bold"
    //let fontFamily = "Avenir Next LT Pro Editada"
    let fontFamily = this.fontFamily
    let base
    if(position) {
      base = this.SVGchord_gerarDiagramaBase_Group(tamanhoDoChart,id,position)
    } else {
      base = this.SVGchord_gerarDiagramaBase_Group(tamanhoDoChart,id,1)
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
      let text = document.createElementNS("http://www.w3.org/2000/svg","text")
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
    }
    

    
    acorde.appendChild(text)

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
        let dotValues = ["fill:#333333; fill-opacity:1; stroke:none",cx,cy,"2.6"] //seta os atributos desse dot
        
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
              style="fill:none;stroke:#333333;stroke-width:0.165;" //círculo vazado
            } else {
              style="fill:#333333;stroke:#333333;stroke-width:0.165;" //círculo cheio (baixo)
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
            let pathValues = [d,"1","nonzero","fill:#333333;fill-opacity:1;stroke-width:0.352778",pathLabel]

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
        let pestanaValues = ["round","none","miter",d,"5.01731","1","4","stroke:#333333"]


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

    chord.appendChild(base)
    chord.appendChild(acorde)

    //colocar a camada de acordes no arquivo SVG
   // base.appendChild(acorde)

    //colocar o arquivo SVG na página
    // document.getElementById("vejamos")?.appendChild(base)
    //console.log(base)

    let baseValue = 47.443932
    let translateX:string = ((baseValue*tamanhoDoChart)-baseValue).toString()
    chord.setAttribute("transform","translate(" + translateX + ",0)")


    return(chord)
    
  }  
  ////////////////////////////////////////////////////////////


  SVGchord_footerOnly(){
    let footerSymbols = [
     {
       name:'open circle',
       attributes:{
         labels:['cx','cy','r','style'],
         values:['2.3515','2.3515','2.274132',
         'fill:none;stroke:#333333;stroke-width:0.154736;stroke-linecap:square;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;paint-order:markers fill stroke']
       }
      },
     {
       name:'filled circle',
       attributes:{
         labels:['cx','cy','r','style'],
         values:['2.3515','2.3515','2.274132',
         'fill:#333333;stroke:#333333;stroke-width:0.154736;stroke-linecap:square;stroke-linejoin:bevel;stroke-miterlimit:4;stroke-dasharray:none;paint-order:markers fill stroke']
        }
      },
     {
       name:'x',
       attributes:{
        labels:['d','style'],
        values:['M 3.06618,2.3521202 4.565485,0.85418983 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14194 l -0.570509,-0.57051 c -0.0193,-0.0193 -0.04548,-0.0303 -0.07166,-0.0303 -0.02755,0 -0.05237,0.011 -0.07166,0.0303 L 2.350972,1.6382898 0.85166603,0.14173983 c -0.03858,-0.0386 -0.104729,-0.0386 -0.143316,0 l -0.570505,0.57051 c -0.0193,0.0179 -0.0303,0.0441 -0.0303,0.0703 0,0.0276 0.01101,0.0524 0.0303,0.0717 L 1.63715,2.3521802 0.13784503,3.8487302 c -0.0193,0.0193 -0.0303,0.0441 -0.0303,0.0717 0,0.0262 0.01101,0.0524 0.0303,0.0717 l 0.570505,0.56913 c 0.02067,0.0207 0.04548,0.0303 0.07166,0.0303 0.02618,0 0.05237,-0.01 0.07166,-0.0303 l 1.49930597,-1.49655 1.500684,1.49655 c 0.03996,0.04 0.103354,0.04 0.143316,0 l 0.570509,-0.56913 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14331 z m 0,0',
        'fill:#333333;fill-opacity:1;stroke-width:0.352778']
       }
      }
    ]

    let footersSymbolsSVG: SVGSVGElement[] = []

    footerSymbols.forEach(symbol => {

      let svgInfos = {
        attributes:['xmlns:xlink','xmlns','width','height','viewBox','id'],
        values:[
          'http://www.w3.org/1999/xlink',
          'http://www.w3.org/2000/svg',
          '4.7030001mm',
          '4.7030001mm',
          '0 0 4.7030001 4.703',
          symbol.name
        ]
      }

      //CRIAR ELEMENTO <svg>
      let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      
      //setar os atributos do elemento <svg>
      for(var i=0; i<svgInfos.attributes.length; i++) {
        svg.setAttribute(svgInfos.attributes[i],svgInfos.values[i])
      }

      if(symbol.name == 'x'){
        //CRIA ELEMENTO <path>
        let path = document.createElementNS("http://www.w3.org/2000/svg",'path')

        //cria variável com labels e values dos atributos desse path (desenho de um x)
        let pathLabels = symbol.attributes.labels
        let pathValues = symbol.attributes.values

        //adiciona os atributos no elemento <path>
        for(var a=0; a<pathLabels.length; a++) {
          path.setAttribute(pathLabels[a],pathValues[a])
        }

        //adiciona o elemento no <svg>
        svg.appendChild(path)

        //envia o <svg> para o array de símbolos svg do footer
        footersSymbolsSVG.push(svg)

      } else {
        //CRIA ELEMENTO <circle>
        let circle = document.createElementNS("http://www.w3.org/2000/svg","circle")

        //cria variável com os labels e values dos circles
        let circleLabels = symbol.attributes.labels
        let circleValues = symbol.attributes.values

        //adiciona os atributos no elemento <path>
        for(var c=0; c<circleLabels.length; c++) {
          circle.setAttribute(circleLabels[c],circleValues[c])
        }

        //adiciona o elemento no <svg>
        svg.appendChild(circle)

        //envia o <svg> para o array de símbolos svg do footer
        footersSymbolsSVG.push(svg)

      }

      

    })

    return(footersSymbolsSVG)

  }




 //ARQUIVO 
/* 
  SVG_gerarDiagramaBase(id:string,position:number) {

    let fontFamily = "Avenir Atelie do Violão Bold" //aplicada só à indicação de posição

    let pathLabels = ["stroke-linecap", "fill","stroke-linejoin","d","stroke","stroke-width","stroke-opacity","stroke-miterlimit","style"]

    let paths = {
       headDireito:["butt","none","miter","m 38.178987,8.83911 3.20121,-8.68853","#000000","0.703037","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       headEsquerdo:["butt","none","miter","M 8.041717,8.84393 4.854299,0.14576","#000000","1.99464","1","1","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.702998;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"],
       pestana:["butt","none","miter","M 7.769288,9.55474 H 38.493817","#000000","2.33578","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       pestanaAlt:["butt","none","miter","M 8.021455,10.371489 H 38.185327","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste1:["butt","none","miter","M 8.064175,16.49309 H 38.228047","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste2:["butt","none","miter","M 8.106896,22.6147 H 38.270767","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste3:["butt","none","miter","M 8.064175,28.73631 H 38.228047","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste4:["butt","none","miter","M 8.064175,34.85791 H 38.228047","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste5:["butt","none","miter","M 8.064175,40.97952 H 38.228047","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       corda1:["butt","none","miter","M 38.357007,8.4067008 V 44.91657","#000000","1.99511","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.3175;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda2:["butt","none","miter","M 32.303137,8.4067008 V 44.9207","#000000","1.99316","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.423333;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda3:["butt","none","miter","M 26.249255,8.4067008 V 44.96481","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.529167;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda4:["butt","none","miter","M 20.195352,8.4067008 V 44.96481","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.635;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda5:["butt","none","miter","M 14.14147,8.4067008 V 44.84077","#000000","1.99134","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.740833;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       corda6:["butt","none","miter","M 8.087599,8.40683 V 44.9207","#000000","1.99353","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.846667;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"]
     }
  
    // CRIAR O ELEMENTO SVG:
     let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
     svg1.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink")
     svg1.setAttribute("xmlns","http://www.w3.org/2000/svg")
     svg1.setAttribute("width","46.443932mm")
     svg1.setAttribute("height","50.022198mm") //era originalmente 50...
     svg1.setAttribute("viewBox","0 0 46.443932 50.022198")
     svg1.setAttribute("id",id)
     svg1.classList.add("destacar")
    ////////////////////////////////////////////////////////////////////////////


    //CRIAR TAG DE ESTILO COM INFORMAÇÃO DA FONTE PERSONALIZADA
      let style = document.createElementNS("http://www.w3.org/2000/svg","style")
      style.setAttribute("type","text/css")

      let avenirBase64 = ''

      //fazer um getRequest pra pegar a fonte em base64 do backend do site jonathanspinelli.com no Wix:
      let url = "https://jonathanspinelli.com/_functions/AvenirFont"
      this.http.get(url).toPromise().then((data:any) => {
        avenirBase64 = data.avenirBase64
        style.innerHTML = "@font-face {font-family:'Avenir Atelie do Violão Bold'; src:url('" + avenirBase64 + "')}"
        svg1.appendChild(style) //enviar a tag <style> pro arquivo SVG
      })
    /////////////////////////////////////////////////////////////////////
  

  
    // CRIAR A CAMADA DO DIAGRAMA BASE:
     let gDiagramaBase = document.createElementNS("http://www.w3.org/2000/svg", "g")
     gDiagramaBase.setAttribute("id","DIAGRAMA")
     //gDiagramaBase.setAttribute("inkscape:groupmode","layer")
     //gDiagramaBase.setAttribute("inkscape:label","DIAGRAMA")
    ///////////////////////////////////////////////////////////////////////////// 
  
  
  
  
    // CRIAR O GRUPO PARA O HEADSTOCK
     let gDB_Head = document.createElementNS("http://www.w3.org/2000/svg", "g")
     gDB_Head.setAttribute("id","head")
    // gDB_Head.setAttribute("inkscape:label","head")
    /////////////////////////////////////////////////////////////////////////////
  
    //CRIAR O HEADSTOCK
     let headDireito = document.createElementNS("http://www.w3.org/2000/svg","path")
     let headEsquerdo = document.createElementNS("http://www.w3.org/2000/svg","path")
     ////////////////
  
  
  
  
  
    // CRIAR O GRUPO PARA OS TRASTES
    let gDB_Trastes = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Trastes.setAttribute("id","trastes")
   // gDB_Trastes.setAttribute("inkscape:label","trastes")
    /////////////////////////////////////////////////////////////////////////////
  
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
  
  
  
  
    // CRIAR O GRUPO PARA AS CORDAS
    let gDB_Cordas = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Cordas.setAttribute("id","cordas")
   // gDB_Cordas.setAttribute("inkscape:label","cordas")
    /////////////////////////////////////////////////////////////////////////////
  
    // CRIAR AS CORDAS
    let corda1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda3 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda4 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda5 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda6 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    ///////////////////////////////////////////////////////////////////////////////////
  
    // CRIAR TEXTO DE POSIÇÃO, CASO SEJA INFORMADA
    if(position > 1) {
      let positionLabels = ["xml:space","style","x","y"]
      let positionValues = [
        "preserve",
        "font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:5.19751px;line-height:1.25;font-family:'" + fontFamily + "';-inkscape-font-specification:'Avenir Next LT Pro, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;text-anchor:end;fill:#000000;stroke-width:0.182553",
        "5.2235003",
        "15.261813"
      ]
      for(var i = 0; i<positionLabels.length; i++) {
        trastes_position.setAttribute(positionLabels[i],positionValues[i])
      }
      let positionNumber = position.toString() + "ª"
      trastes_positionText.textContent = positionNumber
      trastes_position.appendChild(trastes_positionText)
      gDB_Trastes.appendChild(trastes_position)
    }
    
  
  
  
  
    //CRIAR ATRIBUTOS PARA OS PATHS (heads, trastes e cordas)
    for(var i = 0; i < pathLabels.length; i++) {
      headDireito.setAttribute(pathLabels[i], paths.headDireito[i])
      headEsquerdo.setAttribute(pathLabels[i], paths.headEsquerdo[i])
      trastes_pestana.setAttribute(pathLabels[i], paths.pestana[i])
      trastes_pestanaAlt.setAttribute(pathLabels[i],paths.pestanaAlt[i])
      trastes_traste1.setAttribute(pathLabels[i], paths.traste1[i])
      trastes_traste2.setAttribute(pathLabels[i], paths.traste2[i])
      trastes_traste3.setAttribute(pathLabels[i], paths.traste3[i])
      trastes_traste4.setAttribute(pathLabels[i], paths.traste4[i])
      trastes_traste5.setAttribute(pathLabels[i], paths.traste5[i])
      corda1.setAttribute(pathLabels[i], paths.corda1[i])
      corda2.setAttribute(pathLabels[i], paths.corda2[i])
      corda3.setAttribute(pathLabels[i], paths.corda3[i])
      corda4.setAttribute(pathLabels[i], paths.corda4[i])
      corda5.setAttribute(pathLabels[i], paths.corda5[i])
      corda6.setAttribute(pathLabels[i], paths.corda6[i])
    }
  
  
    //ADICIONAR ELEMENTOS NOS GRUPOS
    gDB_Trastes.appendChild(trastes_traste1) //colocar os trastes no grupo de trastes
    gDB_Trastes.appendChild(trastes_traste2)
    gDB_Trastes.appendChild(trastes_traste3)
    gDB_Trastes.appendChild(trastes_traste4)
    gDB_Trastes.appendChild(trastes_traste5)
    if(position == 1){
      gDB_Trastes.appendChild(trastes_pestana) 
      gDB_Head.appendChild(headDireito) //colocar os heads no grupo do headstock
      gDB_Head.appendChild(headEsquerdo)
    } else {
      gDB_Trastes.appendChild(trastes_pestanaAlt) 
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
  
  
     svg1.appendChild(gDiagramaBase) // colocar o grupo do diagrama base dentro do svg criado
     //document.getElementById("vejamos")?.appendChild(svg1)
     return(svg1)
      
    }

  SVG_gerarAcorde(id:string, title:string, dedos:number[][], footer:string[],pestanaInstr:number[], position? :number) {
    
    let fontFamily = "Avenir Atelie do Violão Bold"
    
    let base
    if(position) {
      base = this.SVG_gerarDiagramaBase(id,position)
    } else {
      base = this.SVG_gerarDiagramaBase(id,1)
    }
    
   // let dotLabels = ["style","cx","cy","r","inkscape:label"]
    let dotLabels = ["style","cx","cy","r"]

    //numeros pra identificar posição (eixo x) de cada corda
    let coordenadasCorda_X = [
      {corda:1, valor:"38.357006"},
      {corda:2, valor:"32.303139"},
      {corda:3, valor:"26.249254"},
      {corda:4, valor:"20.195353"},
      {corda:5, valor:"14.14147"},
      {corda:6, valor:"8.0875988"}
    ]

    //numeros pra identificar posição (eixo y) de cada casa
    let coordenadasCasa_Y = [
      {casa:1, valor:"13.432287"},
      {casa:2, valor:"19.553894"},
      {casa:3, valor:"25.675505"},
      {casa:4, valor:"31.797112"},
      {casa:5, valor:"37.918716"},
    ]

    //GERAR CAMADA DE ACORDE
    let acorde = document.createElementNS("http://www.w3.org/2000/svg","g")
    acorde.setAttribute("id","ACORDE")
   // acorde.setAttribute("inkscape:groupmode","layer")
   // acorde.setAttribute("inkscape:label","ACORDE")

    //TITULO
      let text = document.createElementNS("http://www.w3.org/2000/svg","text")
      let textLabels = ["xml:space","style","x","y","text-anchor"]

      let textValues = [
        "preserve",
        "font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:6.23304px;line-height:1.25;font-family:'" + fontFamily + "';-inkscape-font-specification:'Avenir Next LT Pro, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;text-anchor:end;fill:#333333;stroke-width:0.264583",
        "50%",
        "6.1069942",
        "middle"
      ]
    
    for(var i = 0; i<textLabels.length; i++) {
      text.setAttribute(textLabels[i],textValues[i])
    }
    
    let textContent = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    textContent.setAttribute("text-anchor","middle") //alinhar o texto no centro

    let textContentSuperscript = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    let textContentSubscript = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    textContentSuperscript.setAttribute("style","font-size:80%")
    textContentSuperscript.setAttribute("baseline-shift","60%")
    textContentSubscript.setAttribute("style","font-size:80%")
    textContentSubscript.setAttribute("baseline-shift","-30%")
    textContentSubscript.setAttribute("dx","-0.65em")

    if(title.slice(-2) == "74"){
      textContent.setAttribute("dy","-0.1em")
      let indexOf7 = title.indexOf("7")
      title = title.substring(0,indexOf7)
      textContentSuperscript.textContent = "7"
      textContentSubscript.textContent = "4"
      textContent.textContent = title
      text.appendChild(textContent)
      text.appendChild(textContentSuperscript)
      text.appendChild(textContentSubscript)
    } else {
      textContent.textContent = title
      text.appendChild(textContent)
    }
    

    
    acorde.appendChild(text)

  //LOGICA DEDOS

    //GERAR GRUPO DOS DEDOS
    let gDedos = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDedos.setAttribute("id","dedos")
    //gDedos.setAttribute("inkscape:label","dedos")
    

    //GERAR OS DOTS E POSICIONAR CONFORME NUMEROS DE CORDA E CASA RECEBIDOS:
      if(dedos && dedos.length > 0){

        dedos.forEach((dedo:number[]) => { //pra cada array de número de corda e casa recebida:
        let cx = coordenadasCorda_X.filter(e => e.corda == dedo[0])[0].valor //procura a coordenada certa conforme a corda informada
        let cy = coordenadasCasa_Y.filter(e => e.casa == dedo[1])[0].valor   //procura a coordenada certa conforme a casa informada
        let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle") //cria um dot (círculo)
       // let dotValues = ["fill:#333333; fill-opacity:1; stroke:none",cx,cy,"2.6","circle"] //seta os atributos desse dot
        let dotValues = ["fill:#333333; fill-opacity:1; stroke:none",cx,cy,"2.6"] //seta os atributos desse dot
        
          for(var i = 0; i < dotLabels.length; i++) {
            dot.setAttribute(dotLabels[i],dotValues[i]) //coloca os atributos no dot 
          }
          gDedos.appendChild(dot)//envia o dot para o grupo de dedos

        let desenhosNumeros = [
          {numero:1,desenho:" v -3.679837 h -0.800417 l -1.211019,0.888774 0.452183,0.618504 0.686071,-0.530146 v 2.702705 z"},
          {numero:2,desenho:" v -0.758836 h -1.50208 l 0.852392,-0.758836 c 0.337838,-0.301456 0.644491,-0.608109 0.644491,-1.133058 0,-0.769231 -0.654886,-1.127859 -1.330563,-1.127859 -0.717256,0 -1.320167,0.441788 -1.403327,1.185032 l 0.836799,0.114345 c 0.03638,-0.327443 0.22869,-0.556133 0.519751,-0.556133 0.275468,0 0.457381,0.181913 0.457381,0.441788 0,0.223493 -0.119543,0.395011 -0.301456,0.566529 l -1.434513,1.299377 v 0.727651 z"},
          {numero:3,desenho:" c 0,-0.41061 -0.29106,-0.75364 -0.70686,-0.8524 v -0.0156 c 0.35863,-0.0935 0.61851,-0.39501 0.61851,-0.80042 0,-0.70686 -0.64449,-1.0395 -1.294183,-1.0395 -0.613307,0 -1.195428,0.31705 -1.372143,0.93555 l 0.810812,0.18711 c 0.05717,-0.24948 0.254678,-0.4106 0.504158,-0.4106 0.239085,0 0.462576,0.14033 0.462576,0.40541 0,0.35343 -0.317046,0.43659 -0.644489,0.43659 h -0.254678 v 0.63929 h 0.233888 c 0.363826,0 0.748439,0.10915 0.748439,0.48337 0,0.34304 -0.28586,0.46778 -0.535341,0.46778 -0.332641,0 -0.556134,-0.2131 -0.623701,-0.45738 l -0.810812,0.21309 c 0.197506,0.68607 0.805614,0.97714 1.476093,0.97714 0.675681,0 1.387731,-0.36383 1.387731,-1.16944 z"},
          {numero:4, desenho:" v -0.706862 h -0.50935 v -2.255719 h -1.0447 l -1.49689,2.229732 v 0.732849 h 1.73078 v 0.717256 h 0.816 v -0.717256 z m -1.31497,-0.706862 h -0.88877 l 0.87318,-1.361747 h 0.0156 z"}
        ] 

        let coordenadasDedos = [
          {dedo:1, coordenadas:[
            {eixo:"x",coordenadas:[
              {corda:1, valor:"39.012506"},
              {corda:2, valor:"32.958639"},
              {corda:3, valor:"26.904754"},
              {corda:4, valor:"20.850853"},
              {corda:5, valor:"14.79697"},
              {corda:6, valor:"8.7430988"}
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"15.201335"},
              {casa:2, valor:"21.322942"},
              {casa:3, valor:"27.444553"},
              {casa:4, valor:"33.56616"},
              {casa:5, valor:"39.687764"}
            ]}
          ]},
          {dedo:2, coordenadas:[
            {eixo:"x",coordenadas:[
              {corda:1, valor:"39.726551"},
              {corda:2, valor:"33.672684"},
              {corda:3, valor:"27.618799"},
              {corda:4, valor:"21.564898"},
              {corda:5, valor:"15.511015"},
              {corda:6, valor:"9.4571438"}            
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"15.201335"},
              {casa:2, valor:"21.322942"},
              {casa:3, valor:"27.444553"},
              {casa:4, valor:"33.56616"},
              {casa:5, valor:"39.687764"}
            ]}
          ]},
          {dedo:3, coordenadas:[
            {eixo:"x", coordenadas:[
              {corda:1, valor:"39.789006"},
              {corda:2, valor:"33.735139"},
              {corda:3, valor:"27.618799"},
              {corda:4, valor:"21.627353"},
              {corda:5, valor:"15.57347"},
              {corda:6, valor:"9.5195988"}  
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"14.222287"},
              {casa:2, valor:"20.343894"},
              {casa:3, valor:"26.465505"},
              {casa:4, valor:"32.587112"},
              {casa:5, valor:"38.708716"}
            ]}
          ]},
          {dedo:4, coordenadas:[
            {eixo:"x", coordenadas:[
              {corda:1, valor:"39.789006"},
              {corda:2, valor:"33.735139"},
              {corda:3, valor:"27.618799"},
              {corda:4, valor:"21.627353"},
              {corda:5, valor:"15.57347"},
              {corda:6, valor:"9.5195988"}              
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"14.420271"},
              {casa:2, valor:"20.541878"},
              {casa:3, valor:"26.663489"},
              {casa:4, valor:"32.785096"},
              {casa:5, valor:"38.9067"}           
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
     // gFooter.setAttribute("inkscape:label","footer")
    
      let pathLabels = ["d","fill-opacity","fill-rule","style"]
      
      if(footer && footer.length == 6){
       
       let footerReverse = Object.assign([],footer) //para não inverter o original
       footerReverse.reverse() //inverte a informação recebida para montar o rodapé (para que a gente possa escrever da 6a pra 1a corda, mas a função trabalha com da 1a a 6a)

        for(var i = 0; i<footerReverse.length; i++) {
          if(footerReverse[i] == "o" || footerReverse[i] == "O"){
            let sign = document.createElementNS("http://www.w3.org/2000/svg","circle")
            let style = ""
            if(footerReverse[i] == "o"){
              style="fill:none;stroke:#333333;stroke-width:0.165;" //círculo vazado
            } else {
              style="fill:#333333;stroke:#333333;stroke-width:0.165;" //círculo cheio (baixo)
            }
            let cx = coordenadasCorda_X.filter(e => e.corda == i+1)[0].valor //determina a corda
            let cy = "47.670696" //valor fixo (base do desenho)
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
            //let corda = coordenadasCorda_X.filter(e => e.corda == i+1)[0].valor
            let d = "m " + corda + ",47.782758 1.499305,-1.49793 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14194 l -0.570509,-0.57051 c -0.0193,-0.0193 -0.04548,-0.0303 -0.07166,-0.0303 -0.02755,0 -0.05237,0.011 -0.07166,0.0303 l -1.500684,1.49655 -1.499306,-1.49655 c -0.03858,-0.0386 -0.104729,-0.0386 -0.143316,0 l -0.570505,0.57051 c -0.0193,0.0179 -0.0303,0.0441 -0.0303,0.0703 0,0.0276 0.01101,0.0524 0.0303,0.0717 l 1.499305,1.49793 -1.499305,1.49655 c -0.0193,0.0193 -0.0303,0.0441 -0.0303,0.0717 0,0.0262 0.01101,0.0524 0.0303,0.0717 l 0.570505,0.56913 c 0.02067,0.0207 0.04548,0.0303 0.07166,0.0303 0.02618,0 0.05237,-0.01 0.07166,-0.0303 l 1.499306,-1.49655 1.500684,1.49655 c 0.03996,0.04 0.103354,0.04 0.143316,0 l 0.570509,-0.56913 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14331 z m 0,0"
            let pathLabel = "corda" + (i+1) + "-no"
            let pathValues = [d,"1","nonzero","fill:#333333;fill-opacity:1;stroke-width:0.352778",pathLabel]

            for(var j = 0; j<pathLabels.length; j++) {
              path.setAttribute(pathLabels[j],pathValues[j])
            }
            gFooter.appendChild(path)

          }


        }
      }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
  
    //GERAR PESTANA
      let pestana = document.createElementNS("http://www.w3.org/2000/svg","path")
      //let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style","inkscape:label"]
      let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style"]

      if(pestana && pestanaInstr.length == 3){

        let cordaInicial = coordenadasCorda_X.filter(e => e.corda == pestanaInstr[0])[0].valor
        let cordaFinal = coordenadasCorda_X.filter(e => e.corda == pestanaInstr[1])[0].valor
        let casa = coordenadasCasa_Y.filter(e => e.casa == pestanaInstr[2])[0].valor
        let d = "M " + cordaInicial + "," + casa + " H " + cordaFinal
        let pestanaValues = ["round","none","miter",d,"5.01731","1","4","stroke:#333333"]


        for(var i = 0; i<pestanaLabels.length; i++) {
          pestana.setAttribute(pestanaLabels[i],pestanaValues[i])
        }
        gDedos.appendChild(pestana)
      }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

  
    //colocar o grupo de dedos e o do footer na camada de acordes
    acorde.appendChild(gDedos)
    acorde.appendChild(gFooter)

    //colocar a camada de acordes no arquivo SVG
    base.appendChild(acorde)

    //colocar o arquivo SVG na página
    // document.getElementById("vejamos")?.appendChild(base)
    //console.log(base)
    return(base)
    
  }

  SVG_gerarDiagramaBase_Group(tamanhoDoChart:number,id:string,position:number) {

    let fontFamily = "Avenir Atelie do Violão Bold" //aplicada só à indicação de posição

    //let pathLabels = ["stroke-linecap", "fill","stroke-linejoin","d","stroke","stroke-width","stroke-opacity","stroke-miterlimit","style","inkscape:label"]
    let pathLabels = ["stroke-linecap", "fill","stroke-linejoin","d","stroke","stroke-width","stroke-opacity","stroke-miterlimit","style"]

    let paths = {
       headDireito:["butt","none","miter","m 38.178987,8.83911 3.20121,-8.68853","#000000","0.703037","1","1","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       headEsquerdo:["butt","none","miter","M 8.041717,8.84393 4.854299,0.14576","#000000","1.99464","1","1","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.702998;stroke-miterlimit:1;stroke-dasharray:none;stroke-opacity:1"],
       pestana:["butt","none","miter","M 7.769288,9.55474 H 38.493817","#000000","2.33578","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       pestanaAlt:["butt","none","miter","M 8.021455,10.371489 H 38.185327","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste1:["butt","none","miter","M 8.064175,16.49309 H 38.228047","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste2:["butt","none","miter","M 8.106896,22.6147 H 38.270767","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste3:["butt","none","miter","M 8.064175,28.73631 H 38.228047","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste4:["butt","none","miter","M 8.064175,34.85791 H 38.228047","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       traste5:["butt","none","miter","M 8.064175,40.97952 H 38.228047","#000000","0.702292","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-opacity:1"],
       corda1:["butt","none","miter","M 38.357007,8.4067008 V 44.91657","#000000","1.99511","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.3175;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"],
       corda2:["butt","none","miter","M 32.303137,8.4067008 V 44.9207","#000000","1.99316","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.423333;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"],
       corda3:["butt","none","miter","M 26.249255,8.4067008 V 44.96481","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.529167;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"],
       corda4:["butt","none","miter","M 20.195352,8.4067008 V 44.96481","#000000","1.99481","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.635;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"],
       corda5:["butt","none","miter","M 14.14147,8.4067008 V 44.84077","#000000","1.99134","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.740833;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"],
       corda6:["butt","none","miter","M 8.087599,8.40683 V 44.9207","#000000","1.99353","1","4","fill:#808080;fill-opacity:1;stroke:#999999;stroke-width:0.846667;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"]
     }
  
    // CRIAR O ELEMENTO SVG:
     let svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
     svg1.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink")
     svg1.setAttribute("xmlns","http://www.w3.org/2000/svg")
     svg1.setAttribute("width","46.443932mm")
     svg1.setAttribute("height","52.18864mm") //era originalmente 50...
     svg1.setAttribute("viewBox","0 0 46.443932 54.022198")
     svg1.setAttribute("id",id)
     svg1.classList.add("destacar")
    ////////////////////////////////////////////////////////////////////////////

    let rect = document.createElementNS("http://www.w3.org/2000/svg","rect")
    rect.setAttribute("width","46.443932mm")
    rect.setAttribute("height","52.18864mm")
    
    


    //CRIAR TAG DE ESTILO COM INFORMAÇÃO DA FONTE PERSONALIZADA
      let style = document.createElementNS("http://www.w3.org/2000/svg","style")
      style.setAttribute("type","text/css")
    /////////////////////////////////////////////////////////////////////


  

  
    // CRIAR A CAMADA DO DIAGRAMA BASE:
     let gDiagramaBase = document.createElementNS("http://www.w3.org/2000/svg", "g")
     gDiagramaBase.setAttribute("id","DIAGRAMA")
     //gDiagramaBase.setAttribute("inkscape:groupmode","layer")
     //gDiagramaBase.setAttribute("inkscape:label","DIAGRAMA")
    ///////////////////////////////////////////////////////////////////////////// 
  
  
  
  
    // CRIAR O GRUPO PARA O HEADSTOCK
     let gDB_Head = document.createElementNS("http://www.w3.org/2000/svg", "g")
     gDB_Head.setAttribute("id","head")
    // gDB_Head.setAttribute("inkscape:label","head")
    /////////////////////////////////////////////////////////////////////////////
  
    // CRIAR O HEADSTOCK 
     let headDireito = document.createElementNS("http://www.w3.org/2000/svg","path")
     let headEsquerdo = document.createElementNS("http://www.w3.org/2000/svg","path")
     ////////////////
  
  
  
  
  
    // CRIAR O GRUPO PARA OS TRASTES
    let gDB_Trastes = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Trastes.setAttribute("id","trastes")
   // gDB_Trastes.setAttribute("inkscape:label","trastes")
    /////////////////////////////////////////////////////////////////////////////
  
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
  
  
  
  
    // CRIAR O GRUPO PARA AS CORDAS
    let gDB_Cordas = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDB_Cordas.setAttribute("id","cordas")
   // gDB_Cordas.setAttribute("inkscape:label","cordas")
    /////////////////////////////////////////////////////////////////////////////
  
    // CRIAR AS CORDAS 
    let corda1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda3 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda4 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda5 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    let corda6 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    ///////////////////////////////////////////////////////////////////////////////////
  
    // CRIAR TEXTO DE POSIÇÃO, CASO SEJA INFORMADA
    if(position > 1) {
      let positionLabels = ["xml:space","style","x","y"]
      let positionValues = [
        "preserve",
        "font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:5.19751px;line-height:1.25;font-family:'" + fontFamily + "';-inkscape-font-specification:'Avenir Next LT Pro, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;text-anchor:end;fill:#000000;stroke-width:0.182553",
        "5.2235003",
        "15.261813"
      ]
      for(var i = 0; i<positionLabels.length; i++) {
        trastes_position.setAttribute(positionLabels[i],positionValues[i])
      }
      let positionNumber = position.toString() + "ª"
      trastes_positionText.textContent = positionNumber
      trastes_position.appendChild(trastes_positionText)
      gDB_Trastes.appendChild(trastes_position)
    }
    
  
  
  
  
    //CRIAR ATRIBUTOS PARA OS PATHS (heads, trastes e cordas)
    for(var i = 0; i < pathLabels.length; i++) {
      headDireito.setAttribute(pathLabels[i], paths.headDireito[i])
      headEsquerdo.setAttribute(pathLabels[i], paths.headEsquerdo[i])
      trastes_pestana.setAttribute(pathLabels[i], paths.pestana[i])
      trastes_pestanaAlt.setAttribute(pathLabels[i],paths.pestanaAlt[i])
      trastes_traste1.setAttribute(pathLabels[i], paths.traste1[i])
      trastes_traste2.setAttribute(pathLabels[i], paths.traste2[i])
      trastes_traste3.setAttribute(pathLabels[i], paths.traste3[i])
      trastes_traste4.setAttribute(pathLabels[i], paths.traste4[i])
      trastes_traste5.setAttribute(pathLabels[i], paths.traste5[i])
      corda1.setAttribute(pathLabels[i], paths.corda1[i])
      corda2.setAttribute(pathLabels[i], paths.corda2[i])
      corda3.setAttribute(pathLabels[i], paths.corda3[i])
      corda4.setAttribute(pathLabels[i], paths.corda4[i])
      corda5.setAttribute(pathLabels[i], paths.corda5[i])
      corda6.setAttribute(pathLabels[i], paths.corda6[i])
    }
  
  
    //ADICIONAR ELEMENTOS NOS GRUPOS
    gDB_Trastes.appendChild(trastes_traste1) //colocar os trastes no grupo de trastes
    gDB_Trastes.appendChild(trastes_traste2)
    gDB_Trastes.appendChild(trastes_traste3)
    gDB_Trastes.appendChild(trastes_traste4)
    gDB_Trastes.appendChild(trastes_traste5)
    if(position == 1){
      gDB_Trastes.appendChild(trastes_pestana) 
      gDB_Head.appendChild(headDireito) //colocar os heads no grupo do headstock
      gDB_Head.appendChild(headEsquerdo)
    } else {
      gDB_Trastes.appendChild(trastes_pestanaAlt) 
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
  
  
     //svg1.appendChild(gDiagramaBase) // colocar o grupo do diagrama base dentro do svg criado
     //document.getElementById("vejamos")?.appendChild(svg1)
     return(gDiagramaBase)
      
    }

  SVG_gerarAcorde_Group(tamanhoDoChart:number,id:string, title:string, dedos:number[][], footer:string[],pestanaInstr:number[], position? :number) {
 
    let chord = document.createElementNS("http://www.w3.org/2000/svg", "g")
    chord.setAttribute("id",id)


    let fontFamily = "Avenir Atelie do Violão Bold"
    
    let base
    if(position) {
      base = this.SVG_gerarDiagramaBase_Group(tamanhoDoChart,id,position)
    } else {
      base = this.SVG_gerarDiagramaBase_Group(tamanhoDoChart,id,1)
    }
    
   // let dotLabels = ["style","cx","cy","r","inkscape:label"]
    let dotLabels = ["style","cx","cy","r"]

    //numeros pra identificar posição (eixo x) de cada corda
    let coordenadasCorda_X = [
      {corda:1, valor:"38.357006"},
      {corda:2, valor:"32.303139"},
      {corda:3, valor:"26.249254"},
      {corda:4, valor:"20.195353"},
      {corda:5, valor:"14.14147"},
      {corda:6, valor:"8.0875988"}
    ]

    //numeros pra identificar posição (eixo y) de cada casa
    let coordenadasCasa_Y = [
      {casa:1, valor:"13.432287"},
      {casa:2, valor:"19.553894"},
      {casa:3, valor:"25.675505"},
      {casa:4, valor:"31.797112"},
      {casa:5, valor:"37.918716"},
    ]

    //GERAR CAMADA DE ACORDE
    let acorde = document.createElementNS("http://www.w3.org/2000/svg","g")
    acorde.setAttribute("id","ACORDE")
   // acorde.setAttribute("inkscape:groupmode","layer")
   // acorde.setAttribute("inkscape:label","ACORDE")

    //TITULO
      let text = document.createElementNS("http://www.w3.org/2000/svg","text")
      //let textLabels = ["xml:space","style","x","y","text-anchor","inkscape:label"]
      let textLabels = ["xml:space","style","x","y","text-anchor"]

      let posicionamento:string = (50/tamanhoDoChart) + "%"
      let textValues = [
        "preserve",
        "font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:6.53304px;line-height:1.25;font-family:'" + fontFamily + "';-inkscape-font-specification:'Avenir Next LT Pro, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;text-anchor:end;fill:#333333;stroke-width:0.264583",
        posicionamento,
        "6.1069942",
        "middle"
      ]
    
    for(var i = 0; i<textLabels.length; i++) {
      text.setAttribute(textLabels[i],textValues[i])
    }
    
    let textContent = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    textContent.setAttribute("text-anchor","middle") //alinhar o texto no centro

    let textContentSuperscript = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    let textContentSubscript = document.createElementNS("http://www.w3.org/2000/svg","tspan")
    textContentSuperscript.setAttribute("style","font-size:80%")
    textContentSuperscript.setAttribute("baseline-shift","60%")
    textContentSubscript.setAttribute("style","font-size:80%")
    textContentSubscript.setAttribute("baseline-shift","-30%")
    textContentSubscript.setAttribute("dx","-0.65em")

    if(title.slice(-2) == "74"){
      textContent.setAttribute("dy","-0.1em")
      let indexOf7 = title.indexOf("7")
      title = title.substring(0,indexOf7)
      textContentSuperscript.textContent = "7"
      textContentSubscript.textContent = "4"
      textContent.textContent = title
      text.appendChild(textContent)
      text.appendChild(textContentSuperscript)
      text.appendChild(textContentSubscript)
    } else {
      textContent.textContent = title
      text.appendChild(textContent)
    }
    

    
    acorde.appendChild(text)

  //LOGICA DEDOS

    //GERAR GRUPO DOS DEDOS
    let gDedos = document.createElementNS("http://www.w3.org/2000/svg", "g")
    gDedos.setAttribute("id","dedos")
    //gDedos.setAttribute("inkscape:label","dedos")
    

    //GERAR OS DOTS E POSICIONAR CONFORME NUMEROS DE CORDA E CASA RECEBIDOS:
      if(dedos && dedos.length > 0){

        dedos.forEach((dedo:number[]) => { //pra cada array de número de corda e casa recebida:
        let cx = coordenadasCorda_X.filter(e => e.corda == dedo[0])[0].valor //procura a coordenada certa conforme a corda informada
        let cy = coordenadasCasa_Y.filter(e => e.casa == dedo[1])[0].valor   //procura a coordenada certa conforme a casa informada
        let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle") //cria um dot (círculo)
       // let dotValues = ["fill:#333333; fill-opacity:1; stroke:none",cx,cy,"2.6","circle"] //seta os atributos desse dot
        let dotValues = ["fill:#333333; fill-opacity:1; stroke:none",cx,cy,"2.6"] //seta os atributos desse dot
        
          for(var i = 0; i < dotLabels.length; i++) {
            dot.setAttribute(dotLabels[i],dotValues[i]) //coloca os atributos no dot 
          }
          gDedos.appendChild(dot)//envia o dot para o grupo de dedos

        let desenhosNumeros = [
          {numero:1,desenho:" v -3.679837 h -0.800417 l -1.211019,0.888774 0.452183,0.618504 0.686071,-0.530146 v 2.702705 z"},
          {numero:2,desenho:" v -0.758836 h -1.50208 l 0.852392,-0.758836 c 0.337838,-0.301456 0.644491,-0.608109 0.644491,-1.133058 0,-0.769231 -0.654886,-1.127859 -1.330563,-1.127859 -0.717256,0 -1.320167,0.441788 -1.403327,1.185032 l 0.836799,0.114345 c 0.03638,-0.327443 0.22869,-0.556133 0.519751,-0.556133 0.275468,0 0.457381,0.181913 0.457381,0.441788 0,0.223493 -0.119543,0.395011 -0.301456,0.566529 l -1.434513,1.299377 v 0.727651 z"},
          {numero:3,desenho:" c 0,-0.41061 -0.29106,-0.75364 -0.70686,-0.8524 v -0.0156 c 0.35863,-0.0935 0.61851,-0.39501 0.61851,-0.80042 0,-0.70686 -0.64449,-1.0395 -1.294183,-1.0395 -0.613307,0 -1.195428,0.31705 -1.372143,0.93555 l 0.810812,0.18711 c 0.05717,-0.24948 0.254678,-0.4106 0.504158,-0.4106 0.239085,0 0.462576,0.14033 0.462576,0.40541 0,0.35343 -0.317046,0.43659 -0.644489,0.43659 h -0.254678 v 0.63929 h 0.233888 c 0.363826,0 0.748439,0.10915 0.748439,0.48337 0,0.34304 -0.28586,0.46778 -0.535341,0.46778 -0.332641,0 -0.556134,-0.2131 -0.623701,-0.45738 l -0.810812,0.21309 c 0.197506,0.68607 0.805614,0.97714 1.476093,0.97714 0.675681,0 1.387731,-0.36383 1.387731,-1.16944 z"},
          {numero:4, desenho:" v -0.706862 h -0.50935 v -2.255719 h -1.0447 l -1.49689,2.229732 v 0.732849 h 1.73078 v 0.717256 h 0.816 v -0.717256 z m -1.31497,-0.706862 h -0.88877 l 0.87318,-1.361747 h 0.0156 z"}
        ] 

        let coordenadasDedos = [
          {dedo:1, coordenadas:[
            {eixo:"x",coordenadas:[
              {corda:1, valor:"39.012506"},
              {corda:2, valor:"32.958639"},
              {corda:3, valor:"26.904754"},
              {corda:4, valor:"20.850853"},
              {corda:5, valor:"14.79697"},
              {corda:6, valor:"8.7430988"}
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"15.201335"},
              {casa:2, valor:"21.322942"},
              {casa:3, valor:"27.444553"},
              {casa:4, valor:"33.56616"},
              {casa:5, valor:"39.687764"}
            ]}
          ]},
          {dedo:2, coordenadas:[
            {eixo:"x",coordenadas:[
              {corda:1, valor:"39.726551"},
              {corda:2, valor:"33.672684"},
              {corda:3, valor:"27.618799"},
              {corda:4, valor:"21.564898"},
              {corda:5, valor:"15.511015"},
              {corda:6, valor:"9.4571438"}            
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"15.201335"},
              {casa:2, valor:"21.322942"},
              {casa:3, valor:"27.444553"},
              {casa:4, valor:"33.56616"},
              {casa:5, valor:"39.687764"}
            ]}
          ]},
          {dedo:3, coordenadas:[
            {eixo:"x", coordenadas:[
              {corda:1, valor:"39.789006"},
              {corda:2, valor:"33.735139"},
              {corda:3, valor:"27.618799"},
              {corda:4, valor:"21.627353"},
              {corda:5, valor:"15.57347"},
              {corda:6, valor:"9.5195988"}  
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"14.222287"},
              {casa:2, valor:"20.343894"},
              {casa:3, valor:"26.465505"},
              {casa:4, valor:"32.587112"},
              {casa:5, valor:"38.708716"}
            ]}
          ]},
          {dedo:4, coordenadas:[
            {eixo:"x", coordenadas:[
              {corda:1, valor:"39.789006"},
              {corda:2, valor:"33.735139"},
              {corda:3, valor:"27.618799"},
              {corda:4, valor:"21.627353"},
              {corda:5, valor:"15.57347"},
              {corda:6, valor:"9.5195988"}              
            ]},
            {eixo:"y", coordenadas:[
              {casa:1, valor:"14.420271"},
              {casa:2, valor:"20.541878"},
              {casa:3, valor:"26.663489"},
              {casa:4, valor:"32.785096"},
              {casa:5, valor:"38.9067"}           
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
     // gFooter.setAttribute("inkscape:label","footer")
    
      let pathLabels = ["d","fill-opacity","fill-rule","style"]
      
      if(footer && footer.length == 6){
       
       let footerReverse = Object.assign([],footer) //para não inverter o original
       footerReverse.reverse() //inverte a informação recebida para montar o rodapé (para que a gente possa escrever da 6a pra 1a corda, mas a função trabalha com da 1a a 6a)

        for(var i = 0; i<footerReverse.length; i++) {
          if(footerReverse[i] == "o" || footerReverse[i] == "O"){
            let sign = document.createElementNS("http://www.w3.org/2000/svg","circle")
            let style = ""
            if(footerReverse[i] == "o"){
              style="fill:none;stroke:#333333;stroke-width:0.165;" //círculo vazado
            } else {
              style="fill:#333333;stroke:#333333;stroke-width:0.165;" //círculo cheio (baixo)
            }
            let cx = coordenadasCorda_X.filter(e => e.corda == i+1)[0].valor //determina a corda
            let cy = "47.670696" //valor fixo (base do desenho)
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
            //let corda = coordenadasCorda_X.filter(e => e.corda == i+1)[0].valor
            let d = "m " + corda + ",47.782758 1.499305,-1.49793 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14194 l -0.570509,-0.57051 c -0.0193,-0.0193 -0.04548,-0.0303 -0.07166,-0.0303 -0.02755,0 -0.05237,0.011 -0.07166,0.0303 l -1.500684,1.49655 -1.499306,-1.49655 c -0.03858,-0.0386 -0.104729,-0.0386 -0.143316,0 l -0.570505,0.57051 c -0.0193,0.0179 -0.0303,0.0441 -0.0303,0.0703 0,0.0276 0.01101,0.0524 0.0303,0.0717 l 1.499305,1.49793 -1.499305,1.49655 c -0.0193,0.0193 -0.0303,0.0441 -0.0303,0.0717 0,0.0262 0.01101,0.0524 0.0303,0.0717 l 0.570505,0.56913 c 0.02067,0.0207 0.04548,0.0303 0.07166,0.0303 0.02618,0 0.05237,-0.01 0.07166,-0.0303 l 1.499306,-1.49655 1.500684,1.49655 c 0.03996,0.04 0.103354,0.04 0.143316,0 l 0.570509,-0.56913 c 0.03996,-0.04 0.03996,-0.10335 0,-0.14331 z m 0,0"
            let pathLabel = "corda" + (i+1) + "-no"
            let pathValues = [d,"1","nonzero","fill:#333333;fill-opacity:1;stroke-width:0.352778",pathLabel]

            for(var j = 0; j<pathLabels.length; j++) {
              path.setAttribute(pathLabels[j],pathValues[j])
            }
            gFooter.appendChild(path)

          }


        }
      }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
  
    //GERAR PESTANA
      let pestana = document.createElementNS("http://www.w3.org/2000/svg","path")
      //let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style","inkscape:label"]
      let pestanaLabels = ["stroke-linecap","fill","stroke-linejoin","d","stroke-width","stroke-opacity","stroke-miterlimit","style"]

      if(pestana && pestanaInstr.length == 3){

        let cordaInicial = coordenadasCorda_X.filter(e => e.corda == pestanaInstr[0])[0].valor
        let cordaFinal = coordenadasCorda_X.filter(e => e.corda == pestanaInstr[1])[0].valor
        let casa = coordenadasCasa_Y.filter(e => e.casa == pestanaInstr[2])[0].valor
        let d = "M " + cordaInicial + "," + casa + " H " + cordaFinal
        let pestanaValues = ["round","none","miter",d,"5.01731","1","4","stroke:#333333"]


        for(var i = 0; i<pestanaLabels.length; i++) {
          pestana.setAttribute(pestanaLabels[i],pestanaValues[i])
        }
        gDedos.appendChild(pestana)
      }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////

  
    //colocar o grupo de dedos e o do footer na camada de acordes
    acorde.appendChild(gDedos)
    acorde.appendChild(gFooter)

    
    chord.appendChild(base)
    chord.appendChild(acorde)

    //colocar a camada de acordes no arquivo SVG
    //base.appendChild(acorde)

    //colocar o arquivo SVG na página
    // document.getElementById("vejamos")?.appendChild(base)
    //console.log(base)
    //console.log(tamanhoDoChart)

    let baseValue = 46.3
    let translateX:string = ((baseValue*tamanhoDoChart)-baseValue).toString()
    chord.setAttribute("transform","translate(" + translateX + ",0)")

    return(chord)




  }
 */

  SVGchord_gerarAcorde_aceitaPestanaS(id:string, title:string, dedos:number[][], footer:string[],pestanaInstr:number[][], position? :number) {
  
    let fontFamily = "Avenir Atelie do Violão Bold"
    
    let base
    if(position) {
      base = this.SVGchord_gerarDiagramaBase(id,position)
    } else {
      base = this.SVGchord_gerarDiagramaBase(id,1)
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
      let text = document.createElementNS("http://www.w3.org/2000/svg","text")
      let textLabels = ["xml:space","style","x","y","text-anchor"]

      let textValues = [
        "preserve",
        "font-style:normal;font-variant:normal;font-weight:bold;font-stretch:normal;font-size:6.23304px;line-height:1.25;font-family:'" + fontFamily + "';-inkscape-font-specification:'Avenir Next LT Pro, Bold';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;text-align:end;text-anchor:end;fill:#333333;stroke-width:0.264583",
        "50%",
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
    }
    

    
    acorde.appendChild(text)

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
        let dotValues = ["fill:#333333; fill-opacity:1; stroke:none",cx,cy,"2.6"] //seta os atributos desse dot
        
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
              style="fill:none;stroke:#333333;stroke-width:0.165;" //círculo vazado
            } else {
              style="fill:#333333;stroke:#333333;stroke-width:0.165;" //círculo cheio (baixo)
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
            let pathValues = [d,"1","nonzero","fill:#333333;fill-opacity:1;stroke-width:0.352778",pathLabel]

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
        let pestanaValues = ["round","none","miter",d,"5.01731","1","4","stroke:#333333"]


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

    //colocar a camada de acordes no arquivo SVG
    base.appendChild(acorde)

    //colocar o arquivo SVG na página
    // document.getElementById("vejamos")?.appendChild(base)
    //console.log(base)
    return(base)
    
  }  




}




