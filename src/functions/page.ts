import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"
import {Client} from "@notionhq/client"
import {NotionToMarkdown} from "notion-to-md"
import {Converter} from "showdown"
import {embedExternalImages} from "../utils/html"

function authToken(request: HttpRequest): string | undefined {
    const bearer = request.headers.get("Authorization")
    return bearer && bearer.startsWith("Bearer ") ? bearer.substring("Bearer ".length) : undefined
}

function withNotion(request: HttpRequest, f: (notion: Client) => Promise<HttpResponseInit>): Promise<HttpResponseInit> {
    const token = authToken(request)
    if (!token) {
        return Promise.resolve({status: 401, body: "Unauthorized"})
    }
    const notion = new Client({
        auth: token
    })
    return f(notion)
}

async function markdown(
    request: HttpRequest,
    context: InvocationContext,
    transformMarkdown: (body: string) => string | Promise<string> = s => s,
    contentType = "text/markdown"
): Promise<HttpResponseInit> {
    return withNotion(request, async notion => {
        const n2m = new NotionToMarkdown({notionClient: notion})
        const mdblocks = await n2m.pageToMarkdown(request.params.pageId)
        const markdownString = n2m.toMarkdownString(mdblocks).parent
        const body = await transformMarkdown(markdownString)
        return {body, headers: {'Content-Type': contentType}}
    })
}

async function html(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const markdownToHtml = async (body: string) => {
        const showdown = new Converter({
            tables: true,
            tasklists: true,
        })
        const html = showdown.makeHtml(body)
        const embedImages = request.query.get("embedImages")?.toLowerCase() === "true"
        return embedImages ? await embedExternalImages(html) : html
    }
    return markdown(request, context, markdownToHtml, "text/html")
}

app.http('markdown', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "page/{pageId}/content/markdown",
    handler: markdown,
})
app.http('html', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "page/{pageId}/content/html",
    handler: html,
})
