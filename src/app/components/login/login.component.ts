import { Component } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  loginObj : any ={
    "email" : "",
    "password": "",
  }
  registerObj : any ={
    "username" : "",
    "email" : "",
    "password": "",
  }

  constructor(private masterSrv: MasterService, private authService : AuthService, private router: Router) {}

   

  // async onLogin(){
  //   try{
  //     const res: any = this.masterSrv.login(this.loginObj);
  //     console.log(res.token);
  //     localStorage.setItem('token',res.token);
  //     this.router.navigate(["/dashboard"]);
  //   }
  //   catch(error){
  //     console.error('Login failed', error);
  //   }
  // }

  async onLogin() {
    try {
      const res: any = await firstValueFrom(this.masterSrv.login(this.loginObj));
      console.log(res.token);
      localStorage.setItem('token', res.token);
      this.router.navigate(["/dashboard"]);
    } catch (error) {
      console.error('Login failed', error);
    }
  }

  // async onRegister() {
  //   try {
  //     const res: any = await this.masterSrv.register(this.registerObj);
  //     console.log('User registered successfully', res);
  //     alert('Registration successful. You can now log in.');
  //   } catch (error) {
  //     console.error('Error registering:', error);
  //     alert('Error registering. Please try again.');
  //   }
  // }

  async onRegister() {
    try {
      const res: any = await firstValueFrom(this.masterSrv.register(this.registerObj));
      console.log('User registered successfully', res);
      alert('Registration successful. You can now log in.');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error registering. Please try again.');
    }
  }

}
