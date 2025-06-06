// utils/storageUtils.ts
export function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
  if (jsonString === null) {
    return fallback;
  }
  try {
    // Ensure the parsed type matches T, though JSON.parse returns any
    const parsed = JSON.parse(jsonString);
    // A more robust check might involve a type guard or schema validation if T is complex
    return parsed as T; 
  } catch (error) {
    console.error("Failed to parse JSON from localStorage for key. Returning fallback. Error:", error);
    return fallback;
  }
}