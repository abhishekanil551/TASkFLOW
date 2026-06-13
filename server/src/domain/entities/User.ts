export interface User {
  id?: string
  name: string
  email: string
  password: string
  otp: string
  otpExpires?: Date | null;
  isVerified: boolean
}

export interface normalUser {
  id: string
  name: string
  email: string
  
}