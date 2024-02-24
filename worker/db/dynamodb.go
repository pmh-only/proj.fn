package db

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

type DB struct {
	client dynamodb.Client
}

func New() DB {
	db := new(DB)
	db.initDynamoDBClient()

	return *db
}

func (db *DB) initDynamoDBClient() {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatalf("Unable to load DynamoDB SDK config, %v", err)
	}

	db.client = *dynamodb.NewFromConfig(cfg)
}
