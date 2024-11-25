package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Page struct {
	ID     primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Enable bool               `json:"enable"`
	Body   string             `json:"body"`
	Title  string             `json:"title"`
}

var pages_collection *mongo.Collection

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("error: no .env file found")
	}

	/* connect MongoDB Database */
	clientOptions := options.Client().ApplyURI(os.Getenv("MONGODB_URI") + "/" + os.Getenv("DB_NAME"))
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())
	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	pages_collection = client.Database(os.Getenv("DB_NAME")).Collection("pages")

	/* Fiber backend server */
	app := fiber.New()
	app.Get("/api/pages", getPages)
	app.Post("/api/pages", createPage)
	app.Patch("/api/pages/:id", updatePage)
	app.Delete("/api/pages/:id", deletePage)

	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}

/* Get pages list */
func getPages(c *fiber.Ctx) error {
	var pages []Page
	cursor, err := pages_collection.Find(context.Background(), bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var page Page
		if err := cursor.Decode(&page); err != nil {
			return c.Status(400).JSON(fiber.Map{"msg": err.Error()})
		}
		pages = append(pages, page)
	}
	return c.Status(200).JSON(pages)
}

/* Create new page */
func createPage(c *fiber.Ctx) error {
	page := new(Page)
	if err := c.BodyParser(page); err != nil {
		return err
	}
	if page.Title == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Title has to exist"})
	}
	if page.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Body has to exist"})
	}
	insertResult, err := pages_collection.InsertOne(context.Background(), page)
	if err != nil {
		return err
	}
	page.ID = insertResult.InsertedID.(primitive.ObjectID)
	return c.Status(201).JSON(page)
}

/* Update page <id> */
func updatePage(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid page id"})
	}
	filter := bson.M{"_id": objectId}
	update := bson.M{"$set": bson.M{"enable": true}}
	_, err = pages_collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{"success": true})
}

/* Delete page <id> */
func deletePage(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invlaid page id"})
	}
	filter := bson.M{"_id": objectId}
	_, err = pages_collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{"success": true})
}
