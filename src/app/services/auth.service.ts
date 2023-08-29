import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponseData } from '../models/AuthResponseDate.model';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.FIREBASE_API_KEY}`,
      {email, password, returnSecuredToken: true})
  }

  formatUser(data: AuthResponseData) {
    const expirationDate = new Date(new Date().getTime());
    console.log(expirationDate);
    const user = new User(data.email, data.idToken,data.localId, expirationDate);
    return user;
  }
}
  