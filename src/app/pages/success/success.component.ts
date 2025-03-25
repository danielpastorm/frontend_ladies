import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  sessionId: string | null = null;
  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    // ✅ Captura el parámetro `session_id` de la URL
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
    console.log("Session ID recibido:", this.sessionId);
  }
}
