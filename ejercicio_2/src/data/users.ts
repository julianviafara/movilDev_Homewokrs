export interface User {
    username: string;
    password: string;
    nombre: string;
  }
  
  export const USERS: User[] = [
    { username: "medico1", password: "medico123", nombre: "Dra. Ana Torres" },
    { username: "medico2", password: "medico456", nombre: "Dr. Luis Rendón" },
  ];