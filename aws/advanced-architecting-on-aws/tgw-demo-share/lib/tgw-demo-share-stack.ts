import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class TgwDemoShareStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Transit Gateway の作成
    const transitGateway = new ec2.CfnTransitGateway(this, 'TransitGateway', {
      description: 'Advanced Architecting Demo Transit Gateway',
      defaultRouteTableAssociation: 'enable',
      defaultRouteTablePropagation: 'enable',
      dnsSupport: 'enable',
      vpnEcmpSupport: 'enable',
      tags: [{
        key: 'Name',
        value: 'Demo-Transit-Gateway'
      }]
    });

    // VPC 1: 開発環境
    const vpcDev = new ec2.Vpc(this, 'VPC-Dev', {
      ipAddresses: ec2.IpAddresses.cidr('10.20.0.0/16'),
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24
        }
      ],
      vpcName: 'Adv-TGW-Dev-VPC'
    });

    // VPC 2: 本番環境
    const vpcProd = new ec2.Vpc(this, 'VPC-Prod', {
      ipAddresses: ec2.IpAddresses.cidr('10.21.0.0/16'),
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24
        }
      ],
      vpcName: 'Adv-TGW-Prod-VPC'
    });

    // VPC 3: 共有サービス
    const vpcShared = new ec2.Vpc(this, 'VPC-Shared', {
      ipAddresses: ec2.IpAddresses.cidr('10.22.0.0/16'),
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24
        },
        {
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24
        }
      ],
      vpcName: 'Adv-TGW-Shared-VPC'
    });

    // Transit Gateway Attachments
    const tgwAttachmentDev = new ec2.CfnTransitGatewayAttachment(this, 'TGW-Attachment-Dev', {
      transitGatewayId: transitGateway.ref,
      vpcId: vpcDev.vpcId,
      subnetIds: vpcDev.privateSubnets.map(subnet => subnet.subnetId),
      tags: [{
        key: 'Name',
        value: 'Dev-VPC-Attachment'
      }]
    });

    const tgwAttachmentProd = new ec2.CfnTransitGatewayAttachment(this, 'TGW-Attachment-Prod', {
      transitGatewayId: transitGateway.ref,
      vpcId: vpcProd.vpcId,
      subnetIds: vpcProd.privateSubnets.map(subnet => subnet.subnetId),
      tags: [{
        key: 'Name',
        value: 'Prod-VPC-Attachment'
      }]
    });

    const tgwAttachmentShared = new ec2.CfnTransitGatewayAttachment(this, 'TGW-Attachment-Shared', {
      transitGatewayId: transitGateway.ref,
      vpcId: vpcShared.vpcId,
      subnetIds: vpcShared.privateSubnets.map(subnet => subnet.subnetId),
      tags: [{
        key: 'Name',
        value: 'Shared-VPC-Attachment'
      }]
    });

    // ルートテーブルへのルート追加
    // Dev VPC から他のVPCへのルート
    vpcDev.privateSubnets.forEach((subnet, index) => {
      new ec2.CfnRoute(this, `Dev-Route-Prod-${index}`, {
        routeTableId: subnet.routeTable.routeTableId,
        destinationCidrBlock: '10.21.0.0/16',
        transitGatewayId: transitGateway.ref
      }).addDependency(tgwAttachmentDev);

      new ec2.CfnRoute(this, `Dev-Route-Shared-${index}`, {
        routeTableId: subnet.routeTable.routeTableId,
        destinationCidrBlock: '10.22.0.0/16',
        transitGatewayId: transitGateway.ref
      }).addDependency(tgwAttachmentDev);
    });

    // Prod VPC から他のVPCへのルート
    vpcProd.privateSubnets.forEach((subnet, index) => {
      new ec2.CfnRoute(this, `Prod-Route-Dev-${index}`, {
        routeTableId: subnet.routeTable.routeTableId,
        destinationCidrBlock: '10.20.0.0/16',
        transitGatewayId: transitGateway.ref
      }).addDependency(tgwAttachmentProd);

      new ec2.CfnRoute(this, `Prod-Route-Shared-${index}`, {
        routeTableId: subnet.routeTable.routeTableId,
        destinationCidrBlock: '10.22.0.0/16',
        transitGatewayId: transitGateway.ref
      }).addDependency(tgwAttachmentProd);
    });

    // Shared VPC から他のVPCへのルート
    vpcShared.privateSubnets.forEach((subnet, index) => {
      new ec2.CfnRoute(this, `Shared-Route-Dev-${index}`, {
        routeTableId: subnet.routeTable.routeTableId,
        destinationCidrBlock: '10.20.0.0/16',
        transitGatewayId: transitGateway.ref
      }).addDependency(tgwAttachmentShared);

      new ec2.CfnRoute(this, `Shared-Route-Prod-${index}`, {
        routeTableId: subnet.routeTable.routeTableId,
        destinationCidrBlock: '10.21.0.0/16',
        transitGatewayId: transitGateway.ref
      }).addDependency(tgwAttachmentShared);
    });

    // セキュリティグループ (VPC間通信許可)
    const sgDev = new ec2.SecurityGroup(this, 'SG-Dev', {
      vpc: vpcDev,
      description: 'Dev VPC Security Group',
      allowAllOutbound: true
    });
    sgDev.addIngressRule(ec2.Peer.ipv4('10.0.0.0/8'), ec2.Port.allTraffic(), 'Allow all internal traffic');

    const sgProd = new ec2.SecurityGroup(this, 'SG-Prod', {
      vpc: vpcProd,
      description: 'Prod VPC Security Group',
      allowAllOutbound: true
    });
    sgProd.addIngressRule(ec2.Peer.ipv4('10.0.0.0/8'), ec2.Port.allTraffic(), 'Allow all internal traffic');

    const sgShared = new ec2.SecurityGroup(this, 'SG-Shared', {
      vpc: vpcShared,
      description: 'Shared VPC Security Group',
      allowAllOutbound: true
    });
    sgShared.addIngressRule(ec2.Peer.ipv4('10.0.0.0/8'), ec2.Port.allTraffic(), 'Allow all internal traffic');

    // EC2インスタンスロール
    const ec2Role = new iam.Role(this, 'EC2InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
      ]
    });

    // テスト用EC2インスタンス (各VPCに1つ)
    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO);
    const machineImage = ec2.MachineImage.latestAmazonLinux2023();

    // Dev VPC インスタンス
    const instanceDev = new ec2.Instance(this, 'Instance-Dev', {
      vpc: vpcDev,
      instanceType,
      machineImage,
      securityGroup: sgDev,
      role: ec2Role,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      instanceName: 'Dev-Test-Instance'
    });

    // Prod VPC インスタンス
    const instanceProd = new ec2.Instance(this, 'Instance-Prod', {
      vpc: vpcProd,
      instanceType,
      machineImage,
      securityGroup: sgProd,
      role: ec2Role,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      instanceName: 'Prod-Test-Instance'
    });

    // Shared VPC インスタンス
    const instanceShared = new ec2.Instance(this, 'Instance-Shared', {
      vpc: vpcShared,
      instanceType,
      machineImage,
      securityGroup: sgShared,
      role: ec2Role,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      instanceName: 'Shared-Test-Instance'
    });

    // Outputs
    new cdk.CfnOutput(this, 'TransitGatewayId', {
      value: transitGateway.ref,
      description: 'Transit Gateway ID'
    });

    new cdk.CfnOutput(this, 'DevInstanceId', {
      value: instanceDev.instanceId,
      description: 'Dev VPC Instance ID'
    });

    new cdk.CfnOutput(this, 'DevInstancePrivateIp', {
      value: instanceDev.instancePrivateIp,
      description: 'Dev VPC Instance Private IP'
    });

    new cdk.CfnOutput(this, 'ProdInstanceId', {
      value: instanceProd.instanceId,
      description: 'Prod VPC Instance ID'
    });

    new cdk.CfnOutput(this, 'ProdInstancePrivateIp', {
      value: instanceProd.instancePrivateIp,
      description: 'Prod VPC Instance Private IP'
    });

    new cdk.CfnOutput(this, 'SharedInstanceId', {
      value: instanceShared.instanceId,
      description: 'Shared VPC Instance ID'
    });

    new cdk.CfnOutput(this, 'SharedInstancePrivateIp', {
      value: instanceShared.instancePrivateIp,
      description: 'Shared VPC Instance Private IP'
    });

    new cdk.CfnOutput(this, 'DevVPCId', {
      value: vpcDev.vpcId,
      description: 'Dev VPC ID'
    });

    new cdk.CfnOutput(this, 'ProdVPCId', {
      value: vpcProd.vpcId,
      description: 'Prod VPC ID'
    });

    new cdk.CfnOutput(this, 'SharedVPCId', {
      value: vpcShared.vpcId,
      description: 'Shared VPC ID'
    });
  }
}