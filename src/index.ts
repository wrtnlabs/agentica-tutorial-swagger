import { Agentica } from "@agentica/core";
import { HttpLlm, OpenApi } from "@samchon/openapi";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const createAgent = async () =>
  new Agentica({
    model: "chatgpt",
    vendor: {
      api: openai,
      model: "gpt-4o-mini",
    },
    controllers: [
      {
        name: "PetStore", // Name of the connector (can be any descriptive name)
        protocol: "http", // Indicates an HTTP-based connector
        application: HttpLlm.application({
          // Convert the Swagger JSON document to an OpenAPI model for Agentica.
          document: OpenApi.convert(
            await fetch("https://petstore.swagger.io/v2/swagger.json").then(
              (r) => r.json() as any
            )
          ),
          model: "chatgpt",
        }),
        connection: {
          // This is the actual API host where the API requests will be sent.
          host: "https://petstore.swagger.io/v2",
        },
      },
    ],
  });
const main = async () => {
  const agent = await createAgent();
  console.log(agent.conversate("What can you do?"));
};

main();
