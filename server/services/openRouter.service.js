const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_TIMEOUT_MS = 30_000;

export class OpenRouterNotConfiguredError extends Error {
  constructor() {
    super("OpenRouter is not configured");
    this.name = "OpenRouterNotConfiguredError";
    this.code = "OPENROUTER_NOT_CONFIGURED";
    this.statusCode = 503;
  }
}

export class OpenRouterRequestError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "OpenRouterRequestError";
    this.code = "OPENROUTER_REQUEST_FAILED";
    this.statusCode = statusCode;
  }
}

function getConfig() {
  return {
    apiKey: String(process.env.OPENROUTER_API_KEY || "").trim(),
    baseUrl: String(process.env.OPENROUTER_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, ""),
    model: String(process.env.OPENROUTER_MODEL || "").trim(),
    appUrl: String(process.env.OPENROUTER_APP_URL || "").trim(),
    appName: String(process.env.OPENROUTER_APP_NAME || "SNSF AI").trim(),
    timeoutMs: Math.max(
      5_000,
      Math.min(120_000, Number(process.env.OPENROUTER_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS)
    ),
  };
}

export function isOpenRouterConfigured() {
  const config = getConfig();
  return Boolean(config.apiKey && config.model);
}

function getEmbeddingConfig() {
  const config = getConfig();
  return {
    ...config,
    model: String(process.env.OPENROUTER_EMBEDDING_MODEL || "").trim(),
  };
}

export function isOpenRouterEmbeddingConfigured() {
  const config = getEmbeddingConfig();
  return Boolean(config.apiKey && config.model);
}

function normalizeContent(content) {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";

  return content
    .filter((part) => part?.type === "text" && typeof part.text === "string")
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join("\n");
}

export async function completeOpenRouter({ messages, maxTokens = 500, temperature = 0.2 }) {
  const config = getConfig();
  if (!config.apiKey || !config.model) throw new OpenRouterNotConfiguredError();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const headers = {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "X-Title": config.appName,
    };

    if (config.appUrl) headers["HTTP-Referer"] = config.appUrl;

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: Math.max(64, Math.min(1_200, Number(maxTokens) || 500)),
        temperature: Math.max(0, Math.min(1, Number(temperature) || 0.2)),
        stream: false,
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const providerMessage = payload?.error?.message || `OpenRouter request failed with ${response.status}`;
      throw new OpenRouterRequestError(
        providerMessage,
        response.status >= 400 && response.status < 500 ? response.status : 502
      );
    }

    const content = normalizeContent(payload?.choices?.[0]?.message?.content);
    if (!content) throw new OpenRouterRequestError("OpenRouter returned an empty response");

    return {
      content,
      model: payload.model || config.model,
      usage: payload.usage || null,
    };
  } catch (error) {
    if (error instanceof OpenRouterRequestError || error instanceof OpenRouterNotConfiguredError) throw error;
    if (error?.name === "AbortError") {
      throw new OpenRouterRequestError("OpenRouter request timed out", 504);
    }
    throw new OpenRouterRequestError("OpenRouter request could not be completed");
  } finally {
    clearTimeout(timeout);
  }
}

export async function embedOpenRouter({ input, inputType = "search_document" }) {
  const config = getEmbeddingConfig();
  if (!config.apiKey || !config.model) {
    throw new OpenRouterNotConfiguredError();
  }

  const values = Array.isArray(input) ? input : [input];
  if (!values.length || values.some((value) => typeof value !== "string" || !value.trim())) {
    throw new OpenRouterRequestError("Embedding input is empty", 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const headers = {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "X-Title": config.appName,
    };
    if (config.appUrl) headers["HTTP-Referer"] = config.appUrl;

    const response = await fetch(`${config.baseUrl}/embeddings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        input: Array.isArray(input) ? input : String(input),
        input_type: inputType,
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new OpenRouterRequestError(
        payload?.error?.message || `OpenRouter embeddings failed with ${response.status}`,
        response.status >= 400 && response.status < 500 ? response.status : 502
      );
    }

    const embeddings = (payload?.data || []).map((item) => item.embedding);
    if (embeddings.length !== values.length || embeddings.some((item) => !Array.isArray(item) || !item.length)) {
      throw new OpenRouterRequestError("OpenRouter returned invalid embeddings");
    }

    return {
      embeddings,
      model: payload.model || config.model,
      usage: payload.usage || null,
    };
  } catch (error) {
    if (error instanceof OpenRouterRequestError || error instanceof OpenRouterNotConfiguredError) throw error;
    if (error?.name === "AbortError") throw new OpenRouterRequestError("OpenRouter embeddings timed out", 504);
    throw new OpenRouterRequestError("OpenRouter embeddings could not be completed");
  } finally {
    clearTimeout(timeout);
  }
}
