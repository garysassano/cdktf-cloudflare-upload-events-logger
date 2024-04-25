import { join } from "path";
import { Fn, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { DataCloudflareAccounts } from "../../.gen/providers/cloudflare/data-cloudflare-accounts";
import { CloudflareProvider } from "../../.gen/providers/cloudflare/provider";
import { Queue } from "../../.gen/providers/cloudflare/queue";
import { QueueConsumer } from "../../.gen/providers/cloudflare/queue-consumer";
import { R2Bucket } from "../../.gen/providers/cloudflare/r2-bucket";
import { R2BucketEventNotification } from "../../.gen/providers/cloudflare/r2-bucket-event-notification";
import { WorkersScript } from "../../.gen/providers/cloudflare/workers-script";
import { WorkersScriptSubdomain } from "../../.gen/providers/cloudflare/workers-script-subdomain";

export class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    //==============================================================================
    // Cloudflare Configuration
    //==============================================================================

    new CloudflareProvider(this, "CloudflareProvider");

    const cfAccounts = new DataCloudflareAccounts(this, "CloudflareAccounts", {
      direction: "asc",
      maxItems: 1,
    });

    const mainAccountId = cfAccounts.result.get(0).id;

    //==============================================================================
    // Cloudflare Workers
    //==============================================================================

    const eventNotificationWriter = new WorkersScript(
      this,
      "EventNotificationWriter",
      {
        accountId: mainAccountId,
        scriptName: "event-notification-writer",
        content: Fn.file(
          join(__dirname, "../functions/event-notification-writer", "index.js"),
        ),
      },
    );
    new WorkersScriptSubdomain(
      this,
      "EventNotificationWriterEnableWorkersDevSubdomain",
      {
        accountId: mainAccountId,
        scriptName: eventNotificationWriter.scriptName,
        enabled: true,
      },
    );

    //==============================================================================
    // Cloudflare Queues
    //==============================================================================

    const eventNotificationQueue = new Queue(this, "EventNotificationQueue", {
      accountId: mainAccountId,
      queueName: "event-notification-queue",
    });
    new QueueConsumer(this, "EventNotificationQueueConsumer", {
      accountId: mainAccountId,
      queueId: eventNotificationQueue.queueId,
      scriptName: eventNotificationWriter.scriptName,
      settings: {
        batchSize: 100,
        maxWaitTimeMs: 5000,
      },
    });

    //==============================================================================
    // Cloudflare R2
    //==============================================================================

    const uploadBucket = new R2Bucket(this, "UploadBucket", {
      accountId: mainAccountId,
      name: "upload-bucket",
    });
    new R2BucketEventNotification(
      this,
      "EventNotificationWriterR2BucketEventNotification",
      {
        accountId: mainAccountId,
        bucketName: uploadBucket.name,
        queueId: eventNotificationQueue.queueId,
        rules: [
          {
            actions: ["PutObject"],
            description: "Notifications from source bucket to queue",
          },
        ],
      },
    );
  }
}
