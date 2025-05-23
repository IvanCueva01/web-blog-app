import apiClient from "./api"; // Assuming your axios instance is exported as default from api.ts
import type { BackendUser } from "@/contexts/AuthContext"; // Corrected import path

interface UpdateProfilePayload {
  username?: string;
  avatar_url?: string;
}

interface UpdateProfileResponse {
  message: string;
  user: BackendUser;
}

export const userService = {
  async updateProfile(
    payload: UpdateProfilePayload
  ): Promise<UpdateProfileResponse> {
    try {
      const response = await apiClient.put<UpdateProfileResponse>(
        "/auth/profile",
        payload
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      throw error.response?.data || new Error("Failed to update profile");
    }
  },

  // We might add a getCurrentUser or getUserById function here later if needed,
  // but AuthContext usually handles holding the current user state.
};
