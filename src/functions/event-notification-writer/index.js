/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async queue(batch, env): Promise<void> {
    const batchId = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `upload-logs-${batchId}.json`;

    // Serialize the entire batch of messages to JSON
    const fileContent = new TextEncoder().encode(
      JSON.stringify(batch.messages)
    );

    // Write the batch of messages to R2
    await env.LOG_BUCKET.put(fileName, fileContent, {
      httpMetadata: {
        contentType: "application/json",
      },
    });
  },
} satisfies ExportedHandler<Env>;