export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  if (typeof window === "undefined") {
    throw new Error("fetchWithAuth can only be used in the browser");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    // Token missing → redirect to login
    window.location.href = "/auth/login";
    return;
  }

  // Merge headers
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    const res = await fetch(base+url, { ...options, headers });

    if (res.status === 401) {
      // Unauthorized → token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
      return;
    }

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    return res.json();
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
}
