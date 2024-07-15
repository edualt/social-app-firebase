class User {
  id: string;
  email: string;
  password: string;
  name: string;
  username: string;
  providerData: object;

  constructor(id: string, email: string, password: string, name: string, username: string, providerData: object) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.username = username;
    this.providerData = providerData;
  }

  toFirebase(){
    return {
      id: this.id,
      email: this.email,
      password: this.password,
      name: this.name,
      username: this.username,
      providerData: this.providerData
    }
  }

  static fromFirebase(data: any){
    return new User(data.id, data.email, data.password, data.name, data.username, data.providerData);
  }
};

export default User;
