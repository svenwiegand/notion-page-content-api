import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {Client} from "@notionhq/client"
import {NotionToMarkdown} from "notion-to-md"
import {Converter} from "showdown"

async function html(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Hola`)
    const notion = new Client({
        auth: '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',
    })
    const n2m = new NotionToMarkdown({notionClient: notion})
    context.log(`Requesting notion page ${request.params.pageId}`)
    const mdblocks = await n2m.pageToMarkdown(request.params.pageId)
    const mdString = n2m.toMarkdownString(mdblocks).parent
    const showdown = new Converter({
        tables: true,
        tasklists: true,
    })
    const htmlString = showdown.makeHtml(mdString)
    return {body: htmlString, headers: {'Content-Type': 'text/html'}}
}

app.http('html', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "page/{pageId}/html",
    handler: html,
})
