package controllers

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/* connect MongoDB Database */
func ConnectMangoDB() *mongo.Client {
	fmt.Println("create DB")
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URI") + "/" + os.Getenv("DB_NAME"))
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}
	return client
}
