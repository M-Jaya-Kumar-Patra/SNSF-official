export async function designAdminApi(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("Please sign in with an administrator account.");
  const form = body instanceof FormData;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/designs/admin${path}`, { method, cache: "no-store", signal: AbortSignal.timeout(form ? 90000 : 25000), headers: { Authorization: `Bearer ${token}`, ...(form ? {} : { "Content-Type": "application/json" }) }, body: body === undefined ? undefined : form ? body : JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || "The request failed. Please try again.");
  return result;
}
