import { Booking } from "./Booking";

export interface Event {
    title: string;
    start: Date;
    end: Date; 
    allDay: boolean;
    colorEvn: string;
    status : number;
    isMe : boolean;
    booking : Booking;
    isToday : boolean;
  }
  