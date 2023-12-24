# proj.fn
Lightweight Discord music streaming infra & application\
powered by AWS serverless services (w. cross region)

## brief structure
![](docs/projfn.drawio.png)

## core components
* `/container` : container image for ecs tasks
* `/function` : serverless codes for Lambda function (yes, there's no discord.js)
* `/terraform` : Terraform manifests for basic infrastructure

## features. (under construction...)
### music queue via Dynamodb
![](docs/feature1.png)

### search videos with discord autocomplete
![](docs/feature2.png)

## copyright notice.
&copy; 2023 Minhyeok Park

MIT Licensed. See [LICENSE file](LICENSE) for more information
