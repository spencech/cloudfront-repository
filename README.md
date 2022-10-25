# Cloudfront Cache Invalidator (AWS Lambda Function)

You can invoke this function from CodePipelines to clear CloudFront caches after a new app deployment. This assumes that you have a function created in Lambda called "cloudfront-cache-invalidator" with the appropriate permissions for executing CloudFront invalidations. I typially set the timeout to 3m because sometimes the request spins for a bit.

## Installation

	npm i

Also if you need to specify AWS profiles or regions for pushing the Lambda, update the following line in package.json

	tsc && mkdir temp && cp -r node_modules build/* temp && cd temp && zip -r lambda.zip * && cd .. && mv temp/lambda.zip . && aws lambda update-function-code --function-name cloudfront-cache-invalidator --zip-file fileb://lambda.zip --profile YOUR_PROFILE_HERE --region YOUR_REGION_HERE && rm -rf temp && rm lambda.zip

## Uploading a new build of this function

	npm run prod
