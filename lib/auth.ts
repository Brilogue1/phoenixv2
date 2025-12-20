import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { SESSION_TOKEN_KEY, USER_INFO_KEY } from "@/constants/oauth";

export type User = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: Date;
};

export async function getSessionToken(): Promise<string | null> {
  try {
    // Web platform uses cookie-based auth, no manual token management needed
    if (Platform.OS === "web") {
      console.log("[Auth] Web platform uses cookie-based auth, skipping token retrieval");
      return null;
    }

    // Use SecureStore for native
    console.log("[Auth] Getting session token...");
    const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
    console.log(
      "[Auth] Session token retrieved from SecureStore:",
      token ? `present (${token.substring(0, 20)}...)` : "missing",
    );
    return token;
  } catch (error) {
    console.error("[Auth] Failed to get session token:", error);
    return null;
  }
}

export async function setSessionToken(token: string): Promise<void> {
  try {
    // Web platform uses cookie-based auth, no manual token management needed
    if (Platform.OS === "web") {
      console.log("[Auth] Web platform uses cookie-based auth, skipping token storage");
      return;
    }

    // Use SecureStore for native
    console.log("[Auth] Setting session token...", token.substring(0, 20) + "...");
    await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
    console.log("[Auth] Session token stored in SecureStore successfully");
  } catch (error) {
    console.error("[Auth] Failed to set session token:", error);
    throw error;
  }
}

export async function removeSessionToken(): Promise<void> {
  try {
    // Web platform uses cookie-based auth, logout is handled by server clearing cookie
    if (Platform.OS === "web") {
      console.log("[Auth] Web platform uses cookie-based auth, skipping token removal");
      return;
    }

    // Use SecureStore for native
    console.log("[Auth] Removing session token...");
    await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
    console.log("[Auth] Session token removed from SecureStore successfully");
  } catch (error) {
    console.error("[Auth] Failed to remove session token:", error);
  }
}

export async function getUserInfo(): Promise<User | null> {
  try {
    console.log("[Auth] Getting user info...");

    let info: string | null = null;
    if (Platform.OS === "web") {
      // Use localStorage for web
      info = window.localStorage.getItem(USER_INFO_KEY);
    } else {
      // Use SecureStore for native
      info = await SecureStore.getItemAsync(USER_INFO_KEY);
    }

    if (!info) {
      console.log("[Auth] No user info found");
      return null;
    }
    const user = JSON.parse(info);
    console.log("[Auth] User info retrieved:", user);
    return user;
  } catch (error) {
    console.error("[Auth] Failed to get user info:", error);
    return null;
  }
}

export async function setUserInfo(user: User): Promise<void> {
  try {
    console.log("[Auth] Setting user info...", user);

    if (Platform.OS === "web") {
      // Use localStorage for web
      window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
      console.log("[Auth] User info stored in localStorage successfully");
      return;
    }

    // Use SecureStore for native
    await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(user));
    console.log("[Auth] User info stored in SecureStore successfully");
  } catch (error) {
    console.error("[Auth] Failed to set user info:", error);
  }
}

export async function clearUserInfo(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      // Use localStorage for web
      window.localStorage.removeItem(USER_INFO_KEY);
      return;
    }

    // Use SecureStore for native
    await SecureStore.deleteItemAsync(USER_INFO_KEY);
  } catch (error) {
    console.error("[Auth] Failed to clear user info:", error);
  }
}

// ===== Google Sheets Login System =====

const SHEET_ID = process.env.EXPO_PUBLIC_GOOGLE_SHEET_ID || '1gi2N5tDW98zRPjKcSNHAuEH57XYW8uufbTjXbHUCIOI';

export interface LoginCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
  team: string;
}

/**
 * Fetch login credentials from Google Sheets
 * Sheet: Logins tab
 * Columns: A=Name, B=Email, C=Password, D=Role, E=Team
 */
async function fetchLoginCredentials(): Promise<LoginCredentials[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=Logins`;
  const response = await fetch(url);
  const text = await response.text();
  // Remove the callback wrapper
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const rows = json.table.rows.map((row: any) => row.c.map((cell: any) => cell?.v || ''));
  
  // Skip header row and map to LoginCredentials
  return rows.slice(1).map((row: string[]) => ({
    name: row[0] || '',
    email: row[1] || '',
    password: row[2] || '',
    role: row[3] || '',
    team: row[4] || '',
  })).filter((cred: LoginCredentials) => cred.email && cred.password); // Filter out empty rows
}

/**
 * Validate login credentials
 * Returns user info if valid, null if invalid
 */
export async function validateLogin(email: string, password: string): Promise<LoginCredentials | null> {
  try {
    console.log('[Auth] validateLogin called with email:', email);
    const credentials = await fetchLoginCredentials();
    console.log('[Auth] Fetched', credentials.length, 'credentials from Logins sheet');
    console.log('[Auth] First few credentials:', credentials.slice(0, 3).map(c => ({ email: c.email, role: c.role })));
    
    const user = credentials.find(
      (cred) => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
    );
    
    if (user) {
      console.log('[Auth] Login successful for:', user.name, user.email, user.role);
    } else {
      console.log('[Auth] Login failed - no matching credentials found');
      console.log('[Auth] Available emails:', credentials.map(c => c.email).join(', '));
    }
    
    return user || null;
  } catch (error) {
    console.error('Login validation error:', error);
    return null;
  }
}
