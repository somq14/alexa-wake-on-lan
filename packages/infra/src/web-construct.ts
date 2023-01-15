import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path from "path";

export type WebConstructProps = {
  hostedZone: route53.IHostedZone;
  domainName: string;
  certificate: acm.ICertificate;
};

export class WebConstruct extends Construct {
  distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: WebConstructProps) {
    super(scope, id);

    // 配信するコンテンツを配置する S3 バケット
    const originBucket = new s3.Bucket(this, "OriginBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // CloudFront のログを配置する S3 バケット
    const logBucket = new s3.Bucket(this, "LogBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        // 配信するコンテンツを指定する
        origin: new origins.S3Origin(originBucket),
        // HTTP でアクセスされたら HTTPS へリダイレクトする
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      // ログの出力先を設定する
      logBucket,

      // ルートへのアクセスに対して返却するコンテンツを設定する
      defaultRootObject: "index.html",
      errorResponses: [
        // S3 に指定されたファイルが存在しないとき、S3 は 403 エラーを返すが、
        // CloudFront により エラーを index.html の返却に置き換える
        // (SPA では、どの画面についても、index.html により表示を行うため)
        // https://aws.amazon.com/jp/premiumsupport/knowledge-center/s3-website-cloudfront-error-403/
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
      ],

      // 日本を含む地域のエッジロケーションからコンテンツを配信する
      // https://docs.aws.amazon.com/ja_jp/AmazonCloudFront/latest/DeveloperGuide/PriceClass.html
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,

      // ドメイン設定
      domainNames: [props.domainName],
      certificate: props.certificate,
    });

    new route53.ARecord(this, "DNSRecord", {
      zone: props.hostedZone,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(this.distribution)
      ),
    });

    // build ディレクトリを S3 にアップロードして、アプリケーションをデプロイする
    new s3deploy.BucketDeployment(this, "Deployment", {
      sources: [
        s3deploy.Source.asset(
          path.resolve(__dirname, "..", "..", "web", "build")
        ),
      ],
      destinationBucket: originBucket,
      // CloudFront のキャッシュを削除し、コンテンツを最新化する
      distribution: this.distribution,
    });
  }
}
