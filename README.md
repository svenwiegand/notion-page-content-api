# notion-page-content-api
An azure function that allows to interact with Notion page contents. It provides the following options:

- get page content as markdown
- get page content as HTML (optionally with images embedded)
- add markdown content to a page

This azure app utilizes the following key libraries for the heavy lifting:

- [notion-to-md](https://github.com/souvikinator/notion-to-md#api)
- [showdown](https://github.com/showdownjs/showdown#readme)
- [@tryfabric/martian](https://github.com/tryfabric/martian)

# Authentication
As the api directly accesses your Notion pages you have to do some setup:

1. Call https://www.notion.com/my-integrations
2. Create a new integration
3. Give it a name, the type "Internal" and click "Save"
4. Give it the required capabilities
   - `Read content` to get page content
   - `Update content` to update page content 
   - Copy the `secret`
5. Go to the page in Notion you want to work on and ensure, that the integration has access to it (top right three-button menu > Connections).

For each of the API calls use bearer token authentication with the secret as your token:

```
Authorization: Bearer <your_secret>
```

# Endpoints
## `GET /page/{pageId}/content/markdown`
Returns a page's content as markdown.

## `POST /page/{pageId}/content/markdown`
Appends the provided markdown to the page's content.

## `GET /page/{pageId}/content/html?embedImages=true`
Returns a page's content as HTML, optionally with external images embedded.