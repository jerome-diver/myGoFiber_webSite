package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Page struct {
	ID     primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Enable bool               `json:"enable"`
	Body   string             `json:"body"`
	Title  string             `json:"title"`
	// Category string             `json:"title"`
	// Parent   primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
}
