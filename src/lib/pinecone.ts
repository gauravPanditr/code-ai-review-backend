import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey:process.env.PINECONE_DB_API_KEY as string
});
const index = pc.index('code-review-embeddings');