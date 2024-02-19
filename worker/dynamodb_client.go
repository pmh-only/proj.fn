package main

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var dynamodbClient dynamodb.Client =
	*initDynamoDBClient()

func initDynamoDBClient() *dynamodb.Client {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("Unable to load DynamoDB SDK config, %v", err)
	}

	return dynamodb.NewFromConfig(cfg)
}
