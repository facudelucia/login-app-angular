import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http"
import { UsuarioModel } from '../models/usuario.model';
import {map} from "rxjs/operators"
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts:"
  private apikey = "AIzaSyCfhwxyTsuqTm_S27j6eFnpkhXcnA5pWec"
  userToken:string
  //create new user
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  //login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  constructor(private http: HttpClient) { 
    this.readToken()
  }
  logout(){
    localStorage.removeItem("token")
  }
  login(usuario: UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken: true
    }
    return this.http.post(`${this.url}signInWithPassword?key=${this.apikey}`, authData)
    .pipe(map((resp:any)=>{
      this.saveToken(resp.idToken)
      return resp
    }))
  }
  register(usuario: UsuarioModel){
    const authData = {
      ...usuario,
      returnSecureToken: true
    }
    return this.http.post(`${this.url}signUp?key=${this.apikey}`, authData)
      .pipe(map((resp:any)=>{
        this.saveToken(resp.idToken)
        return resp
      }))
}
  private saveToken(idToken:string){
    this.userToken = idToken
    localStorage.setItem("token", idToken)
    let today = new Date()
    today.setSeconds(3600)
    localStorage.setItem("expires", today.getTime().toString())
  }
  readToken(){
    if(localStorage.getItem("token")){
      this.userToken = localStorage.getItem("token")
    }else{
      this.userToken = ""
    }
  }
  isAuth():boolean{
    if(this.userToken.length < 2){
      return false
    }
    const expires = Number(localStorage.getItem("expires"))
    const expiresDate = new Date()
    expiresDate.setTime(expires)
    if(expiresDate > new Date()){
      return true
    }else{
      return false
    }
  }
}
