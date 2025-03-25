import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-mm',
  imports: [CommonModule],
  templateUrl: './mm.component.html',
  styleUrl: './mm.component.css'
})


export class MmComponent {
  isPlaying = false;
  isImportant = false;

  flag = this.isImportant && this.isPlaying

  currentLyric = '';
  karaokeLines = [
    { text: 'Hoy te entrego una flor amarilla,', time: 0 },
    { text: 'de esas que alegran la vida,', time: 1 },
    { text: 'como lo haces tú, amorcito mío 💛', time: 2 },
    { text: 'Cuando la mires, recuerda que...', time: 3 },
    { text: 'Te he buscado tanto', time: 6 },
    { text: 'Y hoy que te he encontrado sé', time: 9 },
    { text: 'Que no hay nadie más', time: 14 },
    { text: 'Nunca he sido un santo', time: 18 },
    { text: 'Debo confesarlo, ya', time: 22 },
    { text: 'Con honestidad', time: 26 },
    { text: 'Fueron tantas horas', time: 31 },
    { text: 'Tan solo y triste', time: 35 },
    { text: 'Hasta que te vi', time: 38 },
    { text: 'Tú llenas mi vida', time: 42 },
    { text: 'Tú llenas mi alma', time: 45 },
    { text: 'Por eso siempre quédate aquí', time: 49 },
    { text: 'Solo déjate amar', time: 60 },
    { text: 'Un océano entero', time: 70 },
    { text: 'No me ha impedido llegar', time: 72 },
    { text: 'Hasta donde estás', time: 77 },
    { text: 'Todo lo que hago', time: 82 },
    { text: 'Te lo quiero entregar', time: 85 },
    { text: 'Y cada día más', time: 90 },
    { text: 'Fueron tantas horas', time: 95 },
    { text: 'Tan solo y triste', time: 98 },
    { text: 'Hasta que te vi', time: 101 },
    { text: 'Tú llenas mi vida', time: 105 },
    { text: 'Tú llenas mi alma', time: 108 },
    { text: 'Por eso siempre quédate aquí (Ámame)', time: 112 },
    { text: 'Ámame y déjate amar', time: 122 },
    { text: 'Puedes en mí confiar', time: 125 },
    { text: 'Dime que estás sintiéndome', time: 128 },
    { text: 'Y puedes al fin', time: 133 },
    { text: 'Verte en mí', time: 138 },
    { text: 'Verme en ti', time: 141 },
    { text: 'Tú llenas mi vida', time: 156 },
    { text: 'Tú llenas mi alma', time: 159 },
    { text: 'Por eso siempre déjate amar (Ámame)', time: 162 },
    { text: 'Porque no puedo, si te vas', time: 171 },
    { text: 'Respirar', time: 175 },
    { text: 'Dime que estás sintiéndome', time: 178 },
    { text: 'Déjate amar', time: 184 },
    { text: 'Que no ves', time: 188 },
    { text: 'Que este amor es mi luz', time: 192 },
    { text: 'Te he buscado tanto', time: 202 },
    { text: 'Y hoy que te he encontrado sé', time: 205 },
    { text: 'Que no hay nadie más', time: 210 }
  ];

  lyricInterval: any;

  toggleMusic(audio: HTMLAudioElement) {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      audio.play();
      this.startKaraoke(audio);
    } else {
      audio.pause();
      clearInterval(this.lyricInterval);
    }
  }

  startKaraoke(audio: HTMLAudioElement) {
    this.currentLyric = '';
    let index = 0;

    clearInterval(this.lyricInterval);

    this.lyricInterval = setInterval(() => {
      const currentTime = Math.floor(audio.currentTime);
      console.log(currentTime)
      if (
        index < this.karaokeLines.length &&
        currentTime >= this.karaokeLines[index].time
      ) {
        this.currentLyric = this.karaokeLines[index].text;
        index++;
      }

      if (index >= this.karaokeLines.length) {
        clearInterval(this.lyricInterval);
      }
    }, 500);
  }


}
