import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  async canLoad(): Promise<boolean> {
    try {
      const user = await this.authService.checkAuth();
      if (user) {
        return true;
      } else {
        this.navigate('/login');
        return false;
      }
    } catch (e) {
      this.navigate('/login');
      return false;
    }
  }

  navigate(url: any) {
    this.router.navigateByUrl(url, { replaceUrl: true });
  }
}
