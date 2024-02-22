package main

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type QueueItem struct {
	GuildId          uint64 `dynamodbav:"GuildId"`
	QueueId          uint64 `dynamodbav:"QueueId"`
	VideoId          string `dynamodbav:"VideoId"`
	MusicCurrentTime int    `dynamodbav:"MusicCurrentTime"`
}

func (queueItem QueueItem) GetKey() map[string]types.AttributeValue {
	guildId, err := attributevalue.Marshal(queueItem.GuildId)
	if err != nil {
		log.Fatalln(err)
	}

	queueId, err := attributevalue.Marshal(queueItem.QueueId)
	if err != nil {
		log.Fatalln(err)
	}

	return map[string]types.AttributeValue{
		"GuildId": guildId,
		"QueueId": queueId,
	}
}

func getNextQueueItem() (queueItem *QueueItem, ok bool) {
	keyExpr := expression.Key("GuildId").Equal(
		expression.Value(&types.AttributeValueMemberN{
			Value: DISCORD_GUILD_ID.String(),
		}))

	expr, err := expression.NewBuilder().WithKeyCondition(keyExpr).Build()

	if err != nil {
		log.Printf("Couldn't build expression for query. Here's why: %v\n", err)
		return nil, false
	}

	queryPaginator := dynamodb.NewQueryPaginator(&dynamodbClient, &dynamodb.QueryInput{
		TableName:                 aws.String("projfn-music-queue"),
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		KeyConditionExpression:    expr.KeyCondition(),
		Limit:                     aws.Int32(1),
	})

	for queryPaginator.HasMorePages() {
		response, err := queryPaginator.NextPage(context.TODO())

		if err != nil {
			log.Printf("Couldn't query queue for %v. Here's why: %v\n", DISCORD_GUILD_ID, err)
			return nil, false
		}

		var queueItems []QueueItem

		err = attributevalue.UnmarshalListOfMaps(response.Items, &queueItems)
		if err != nil {
			log.Printf("Couldn't unmarshal query response. Here's why: %v\n", err)
			return nil, false
		}

		if len(queueItems) > 0 {
			queueItem = &queueItems[0]
			break
		}
	}

	return queueItem, true
}

func removeNextQueueItem() {
	queueItem, ok := getNextQueueItem()
	if !ok {
		return
	}

	_, err := dynamodbClient.DeleteItem(context.TODO(), &dynamodb.DeleteItemInput{
		TableName: aws.String("projfn-music-queue"),
		Key:       queueItem.GetKey(),
	})

	if err != nil {
		log.Printf("Couldn't delete %v from the table. Here's why: %v\n", queueItem.QueueId, err)
	}
}
