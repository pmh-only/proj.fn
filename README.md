# proj.fn
Lightweight Discord music streaming infra & application\
powered by AWS serverless services (w. cross region)

## brief structure
![](docs/diagram.png)

## core components
* `/worker` : container image for ecs tasks
* `/functions` : serverless codes for Lambda function (yes, there's no discord.js)
* `/infra` : Terraform manifests for basic infrastructure

## features. (under construction...)
### music queue via Dynamodb
![](docs/feature1.png)

### search videos with discord autocomplete
![](docs/feature2.png)

## copyright notice.
&copy; 2023 Minhyeok Park

MIT Licensed. See [LICENSE file](LICENSE) for more information
