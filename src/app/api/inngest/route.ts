// Optional: see src/inngest/client.ts.
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";

export const { GET, POST, PUT } = serve({
  client: inngest,
  // Every function in src/inngest/functions/ must be added here, or it will never run.
  functions: [],
});
