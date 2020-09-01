import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from "sweetalert2"
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModel
  rememberMe = false
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel()
    if(localStorage.getItem("email")){
      this.usuario.email = localStorage.getItem("email")
      this.rememberMe = true
    }
  }
  login(form: NgForm){
    if(form.invalid){
      return
    }
    Swal.fire({
      allowOutsideClick: false, 
    icon: 'info', 
    text: 'Espera por Favor'
    });
     Swal.showLoading();
    this.auth.login(this.usuario)
      .subscribe((resp)=>{
        console.log(resp)
        Swal.close()
        if(this.rememberMe){
          localStorage.setItem("email", this.usuario.email)
        }
        this.router.navigateByUrl("/home")
      },(err)=>{
        console.log(err.error.error.message)
        Swal.fire(
          "Error",
          err.error.error.message,
          "error",  
        )
      })
  }
}
