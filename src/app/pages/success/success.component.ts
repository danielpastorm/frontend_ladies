import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-success',
  standalone: true,
  imports: [ButtonModule, RouterModule, CommonModule], // ← Aquí agregas los módulos necesarios
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {
  sessionId: string | null = null;
  menuItems = [
    { icon: 'docs', description: 'Reporte Condensado', colorClass: 'bg-condensed-report', path: '/dashboard/billings/condensed-report', key: 'CONDESED_REPORT', visibility: false },
    { icon: 'docs', description: 'Reporte Skyteam', colorClass: 'bg-skyteam-report', path: '/dashboard/billings/sky-team-report', key: 'SKYTEAM_REPORT', visibility: false },
    { icon: 'docs', description: 'Reporte Flujo/Variación', colorClass: 'bg-variation-report', path: '/dashboard/billings/variation-report', key: 'VARIATION_REPORT', visibility: false },
    { icon: 'docs', description: 'Reporte AMEX', colorClass: 'bg-amex-report ', path: '/dashboard/billings/amex-report', key: 'AMEX_REPORT', visibility: false },
    { icon: 'docs', description: 'Reporte Santander', colorClass: 'bg-santander-report', path: '/dashboard/billings/santander-report', key: 'SANTANDER_REPORT', visibility: false },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
    console.log("Session ID recibido:", this.sessionId);
  }


  irAMisPedidos() {
    this.router.navigate(['/compras']); // Ajusta la ruta a la que uses
  }
  
}
