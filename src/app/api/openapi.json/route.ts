import { generateOpenApiDocument } from "trpc-to-openapi";
import { getBaseUrl } from "@/lib/url-utils";
import { appRouter } from "@/trpc/routers/_app";

export async function GET() {
  const openApiDocument = generateOpenApiDocument(appRouter, {
    title: "Hospital Health Asset API",
    description: "API for managing assets in hospital environments",
    version: "1.0.0",
    baseUrl: `${getBaseUrl()}/api/v1`,
    tags: ["Assets"],
    // The API has no authentication, so don't advertise the default bearer scheme
    securitySchemes: {},
  });

  return Response.json(openApiDocument);
}
