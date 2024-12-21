package models

/* To select which Mongo db's collection to go with route's API */
type Collection int8

const (
	PagesAPI Collection = iota
	ArticlesAPI
	CategoriesAPI
	TagsAPI
)

func (c Collection) String() string {
	switch c {
	case PagesAPI:
		return "pages"
	case ArticlesAPI:
		return "articles"
	case CategoriesAPI:
		return "categories"
	case TagsAPI:
		return "tags"
	}
	return ""
}
