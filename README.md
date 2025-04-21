# notion-to-html-azure
An azure function that returns a notion page as HTML.

This azure app utilizes the following libraries:

- [notion-to-md](https://github.com/souvikinator/notion-to-md#api)
- [showdown](https://github.com/showdownjs/showdown#readme)

# Endpoints
## `GET /page/{pageId}/html`
Takes a notion page id and returns the HTML.
