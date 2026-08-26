# SNSF RAG Setup

The assistant uses a customer-safe RAG pipeline:

1. Read product and static SNSF knowledge.
2. Remove private pricing fields before text generation.
3. Strip price-like text defensively.
4. Generate embeddings with OpenAI or OpenRouter.
5. Store chunks in MongoDB collection `ragchunks`.
6. Retrieve with MongoDB Atlas Vector Search in production.

## Environment Variables

Required for embeddings:

```env
EMBEDDING_PROVIDER=openai
OPENAI_API_KEY=your_key
AI_EMBEDDING_MODEL=text-embedding-3-small
```

Or use OpenRouter for embeddings:

```env
EMBEDDING_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small
EMBEDDING_DIMENSIONS=1536
```

LLM provider options:

```env
AI_PROVIDER=openai
AI_CHAT_MODEL=gpt-4.1-mini
```

Or use OpenRouter for chat responses:

```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_CHAT_MODEL=openai/gpt-4o-mini
OPENROUTER_SITE_URL=https://www.snsteelfabrication.com
OPENROUTER_APP_NAME=SNSF Assistant
```

Optional:

```env
MONGODB_VECTOR_INDEX=rag_embedding_index
RAG_VECTOR_DRIVER=atlas
RAG_CHUNK_SIZE=1200
RAG_CHUNK_OVERLAP=160
AI_RATE_LIMIT_WINDOW_MS=60000
AI_RATE_LIMIT_MAX=30
```

`RAG_VECTOR_DRIVER` options:

- `atlas`: production mode. Uses MongoDB Atlas Vector Search and skips local vector fallback.
- `local`: development mode. Uses in-process cosine similarity and does not require Atlas Vector Search.
- `auto`: tries Atlas first, then local vector search if Atlas is unavailable.

## MongoDB Atlas Vector Search Index

Create a Vector Search index on the `ragchunks` collection:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 1536,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "active"
    }
  ]
}
```

Use the index name from `MONGODB_VECTOR_INDEX`, defaulting to `rag_embedding_index`.

For production, set:

```env
RAG_VECTOR_DRIVER=atlas
MONGODB_VECTOR_INDEX=rag_embedding_index
```

If this is configured correctly, the server should not log `Atlas vector search unavailable` during AI chat requests.

## Ingest Knowledge

```bash
npm run rag:ingest
```

Or call the protected endpoint:

```http
POST /api/ai/ingest
Authorization: Bearer <admin-token>
```

## Pricing Rule

Product prices are never included in RAG chunks, vector metadata, retrieved context, prompts, or assistant responses. Price questions are redirected to WhatsApp/call.
