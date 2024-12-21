package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/jerome-diver/myGoFiber_webSite/controllers"
	"github.com/jerome-diver/myGoFiber_webSite/models"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("error: no .env file found")
	}
}

func main() {
	// get MongoDB client
	client := controllers.ConnectMangoDB()
	defer client.Disconnect(context.Background())
	// get CRUD API Routes for MongoDB Collection design
	route_pages := controllers.NewRoutesAPI(client, models.PagesAPI)

	/* Fiber backend server */
	// engine := html.New("./views", ".html")
	// app := fiber.New(fiber.Config{Views: engine})
	app := fiber.New()
	//app.Static("/static", "./static") // get static resources as javascript files to call from index.html
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PATCH,DELETE",
	}))

	//app.Get("/", GetRoot)
	app.Get("/api/pages", route_pages.ReadAll)
	app.Get("/api/pages/:id", route_pages.ReadOne)
	app.Post("/api/pages", route_pages.Create)
	app.Patch("/api/pages/:id", route_pages.Update)
	app.Delete("/api/pages/:id", route_pages.Delete)

	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}

//	func GetRoot(c *fiber.Ctx) error {
//		return filesystem.SendFile(c, http.FS(index), "index.html")
//		c.Response().Header.Set("Content-Type", "text/html")
//		return c.Render("index", fiber.Map{})
//	}
// type tests struct{ test string }

// /* Get pages list */
// func getPages(c *fiber.Ctx) error {
// 	test := tests{test: "ok"}
// 	return c.Status(200).JSON(test)
// }
