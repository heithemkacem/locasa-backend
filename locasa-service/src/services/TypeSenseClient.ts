// typesenseClient.ts
import Typesense from "typesense";
export const typesense = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST!,
      port: parseInt(process.env.TYPESENSE_PORT!),
      protocol: process.env.TYPESENSE_PROTOCOL!,
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY!,
});
