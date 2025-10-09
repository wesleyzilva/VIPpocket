import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private registrationData: any = {};

  setRegistrationData(data: any) {
    this.registrationData = { ...this.registrationData, ...data };
  }

  getRegistrationData() {
    return this.registrationData;
  }
}