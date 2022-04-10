import { Component, OnInit } from '@angular/core';
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

  loadingChords:boolean = true

  getChords() {
    this._generateChordsService.getChords().then(data => {
      this.chords = data
      this.printarAcordes()
      this.loadingChords = false
    })
  }

  printarAcordes() {
    this.chords.forEach((chord:any) => {
      let SVG = this._generateChordsService.SVGchord_gerarAcorde(chord.id,chord.title,chord.dedos,chord.footer,chord.pestana,chord.position)
      document.getElementById("pool")?.appendChild(SVG)
    })
  }

  navigate(){
    this.router.navigate(['/buscador'])
  }

  ngOnInit(): void {
    this.getChords()
  }

}
