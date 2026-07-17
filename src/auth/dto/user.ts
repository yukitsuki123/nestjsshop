export interface UserLogin {
  email: string;
  username: string;
  password: string;
}
export interface UserRegister extends UserLogin {
  confirmpassword: string;
}
