import axios from "axios";

class AuthService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:3001/api/auth";
  }
  

  async login(email: string, password: string) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/login`, 
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error(`Login failed with status code ${response.status}`);
      }
    } catch (error: any) {
      throw error.response ? error.response.data.message : "An unexpected error occurred.";
    }
  }

  async register(name: string, email: string, tel: string, password: string): Promise<{ status: number; message: string }> {
    try {
      const response = await axios.post<{ message: string }>(
        `${this.apiUrl}/register`,
        { name, email, tel, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return { status: response.status, message: response.data.message };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { status: error.response.status, message: error.response.data.message };
      } else {
        console.error("An unexpected error occurred during registration:", error);
        return { status: 500, message: "An unexpected error occurred during registration." };
      }
    }
  }
  
  
}

export default new AuthService();
