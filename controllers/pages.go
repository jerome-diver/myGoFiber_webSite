package controllers

import (
	"context"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/jerome-diver/myGoFiber_webSite/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

/* CRUD routes interface to handle */
type CRUD interface {
	Create(c *fiber.Ctx) error
	ReadAll(c *fiber.Ctx) error
	ReadOne(c *fiber.Ctx) error
	Update(c *fiber.Ctx) error
	Delete(c *fiber.Ctx) error
}

/* Routes CRUD builder for collection's call */
func NewRoutesAPI(client *mongo.Client, table models.Collection) CRUD {
	fmt.Println("Created NewROuteAPI")
	collection := client.Database(os.Getenv("DB_NAME")).Collection(table.String())
	fmt.Println("we have this collection:", collection.Name())
	var answer CRUD
	switch table {
	case models.PagesAPI:
		answer = Pages{collection}
	}
	return answer
}

/* Collections to handle with CRUD interface */
type Pages struct{ *mongo.Collection }
type Articles struct{ *mongo.Collection }
type Categories struct{ *mongo.Collection }
type Tags struct{ *mongo.Collection }

/*----------------------------------
		  Pages collection routes
----------------------------------*/

/* Get page from :id */
func (collection Pages) ReadOne(c *fiber.Ctx) error {
	var page models.Page
	result := collection.FindOne(context.Background(), bson.M{})
	if err := result.Decode(&page); err != nil {
		return c.Status(400).JSON(fiber.Map{"msg": err.Error()})
	}
	return c.Status(200).JSON(page)
}

/* Get pages list */
func (collection Pages) ReadAll(c *fiber.Ctx) error {
	fmt.Println("give back all pages for collection:", collection.Name())
	var pages []models.Page
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		fmt.Println("Fuck on collection research", err.Error())
		//log.Fatal(err)
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var page models.Page
		if err := cursor.Decode(&page); err != nil {
			fmt.Println("Fuck on cursor iteration")
			return c.Status(400).JSON(fiber.Map{"msg": err.Error()})
		}
		pages = append(pages, page)
	}
	return c.Status(200).JSON(pages)
}

/* Create new page */
func (collection Pages) Create(c *fiber.Ctx) error {
	page := new(models.Page)
	if err := c.BodyParser(page); err != nil {
		return err
	}
	if page.Title == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Title has to exist"})
	}
	if page.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Body has to exist"})
	}
	insertResult, err := collection.InsertOne(context.Background(), page)
	if err != nil {
		return err
	}
	page.ID = insertResult.InsertedID.(primitive.ObjectID)
	return c.Status(201).JSON(page)
}

/* Update page <id> */
func (collection Pages) Update(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid page id"})
	}
	filter := bson.M{"_id": objectId}
	update := bson.M{"$set": bson.M{"enable": true}}
	_, err = collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{"success": true})
}

/* Delete page <id> */
func (collection Pages) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invlaid page id"})
	}
	filter := bson.M{"_id": objectId}
	_, err = collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{"success": true})
}
