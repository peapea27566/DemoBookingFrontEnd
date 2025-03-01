export interface User {
  id: number;
  name: string;
  tel : string;
  email : string;
}

export interface Booking {
  id: number;
  user: User;
  checkInDate: string; // ISO date string
  checkOutDate: string; // ISO date string
  note: string;
  status: number;
  createdAt: string; // ISO date string
}



export interface BookingCreate {
  checkInDate: string; 
  checkOutDate: string; 
  note: string;
}


export interface ResponseData {
  message : string;
}

