const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
const OPENROUTER_EMBEDDINGS_URL = "https://openrouter.ai/api/v1/embeddings";

export const DEFAULT_EMBEDDING_MODEL =
  process.env.AI_EMBEDDING_MODEL || "text-embedding-3-small";

const DEFAULT_OPENROUTER_EMBEDDING_MODEL =
  process.env.OPENROUTER_EMBEDDING_MODEL || "openai/text-embedding-3-small";

async function parseProviderError(response, label) {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = { error: { message: await response.text() } };
  }

  const error = new Error(
    payload?.error?.message || `${label} provider error: ${response.status}`,
  );
  error.status = response.status;
  error.code = payload?.error?.code;
  error.type = payload?.error?.type;
  return error;
}

function getEmbeddingConfig() {
  const provider = (process.env.EMBEDDING_PROVIDER || "openai").toLowerCase();

  if (provider === "openrouter") {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is required for OpenRouter embeddings.");
    }

    return {
      provider,
      url: OPENROUTER_EMBEDDINGS_URL,
      model: DEFAULT_OPENROUTER_EMBEDDING_MODEL,
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.OPENROUTER_SITE_URL ||
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://www.snsteelfabrication.com",
        "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "SNSF Assistant",
      },
      extraBody: {
        dimensions: Number(process.env.EMBEDDING_DIMENSIONS) || 1536,
      },
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for OpenAI embeddings.");
  }

  return {
    provider: "openai",
    url: OPENAI_EMBEDDINGS_URL,
    model: DEFAULT_EMBEDDING_MODEL,
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    extraBody: {},
  };
}

async function requestEmbeddings(input) {
  const config = getEmbeddingConfig();

  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      model: config.model,
      input,
      ...config.extraBody,
    }),
  });

  if (!response.ok) {
    const error = await parseProviderError(response, "Embedding");
    error.provider = config.provider;
    throw error;
  }

  const data = await response.json();
  return (data?.data || []).sort((a, b) => a.index - b.index);
}

export async function createEmbedding(input) {
  const embeddings = await requestEmbeddings(input);
  const embedding = embeddings?.[0]?.embedding;
  if (!Array.isArray(embedding) || !embedding.length) {
    throw new Error("Embedding provider returned an empty embedding.");
  }

  return embedding;
}

export async function createEmbeddings(inputs) {
  if (!inputs.length) return [];
  return (await requestEmbeddings(inputs)).map((item) => item.embedding);
}
