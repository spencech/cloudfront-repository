import { CloudFrontClient, CreateInvalidationCommand} from "@aws-sdk/client-cloudfront";
import { CodePipelineClient, PutJobSuccessResultCommand, PutJobFailureResultCommand } from "@aws-sdk/client-codepipeline";
import * as randomstring from "randomstring";

export const handler = async (event: any = {}): Promise<any> => { 
  const params = event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters; 
  const DistributionId = JSON.parse(params)?.cloudfrontId || process.env.CLOUDFRONT_ID;
  const CallerReference = randomstring.generate(16);
  const Paths = { Quantity: 1, Items: ["/*"] };
  const InvalidationBatch = { CallerReference, Paths};
  const region = process.env.AWS_REGION_ID;
  const cloudfront = new CloudFrontClient({ region });
  const input = { DistributionId, InvalidationBatch }
  const invalidate = new CreateInvalidationCommand(input);

  const pipeline = new CodePipelineClient({ region });
  const jobId = event["CodePipeline.job"].id;
  const success = new PutJobSuccessResultCommand({ jobId });
  
  try {
    await cloudfront.send(invalidate);
    await pipeline.send(success);
  } catch(error) {
    const failureDetails = {
      message: JSON.stringify(error),
      type: 'JobFailed',
      externalExecutionId: event.context?.awsRequestId
    };
    const failure = new PutJobFailureResultCommand({ jobId, failureDetails });
    await pipeline.send(failure);
    console.log(failureDetails);
  } 
  
}