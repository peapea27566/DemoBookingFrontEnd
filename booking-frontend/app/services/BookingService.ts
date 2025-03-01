import ApiClient from "./ApiClient";
import { Booking, BookingCreate, ResponseData, User } from "../models/Booking";
import axios, { AxiosError } from "axios";

class BookingService {
  private apiClient;
  constructor() {
    this.apiClient = new ApiClient(
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api"
    ).instance;
  }

  async getUser(): Promise<any> {
    const { data } = await this.apiClient.get<any>("/auth/user");
    return data;
  }

  async getBookings(year: Number, month: Number): Promise<Booking[]> {
    const { data } = await this.apiClient.get<Booking[]>("/bookings", {
      params: {
        year: year,
        month: month,
      },
    });
    return data;
  }

  async createBooking(
    booking: BookingCreate
  ): Promise<{ status: number; message: string }> {
    try {
      const response = await this.apiClient.post<ResponseData>('/bookings', booking);
      return { status: response.status, message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { status: error.response.status, message: error.response.data.message };
      } else {
        console.error('An unexpected error occurred:', error);
        return { status: 500, message: 'An unexpected error occurred' };
      }
    }
  }

  async updateStatusBooking(
    id: number,
    status: number
  ): Promise<{ status: number; message: string }> {
    try {
      const response = await this.apiClient.put<ResponseData>(`/bookings/${id}/status`, { status });
      return { status: response.status, message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { status: error.response.status, message: error.response.data.message };
      } else {
        console.error('An unexpected error occurred:', error);
        return { status: 500, message: 'An unexpected error occurred' };
      }
    }
  }
}

export default new BookingService();
