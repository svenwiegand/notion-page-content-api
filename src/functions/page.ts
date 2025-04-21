import {app, HttpRequest, HttpResponseInit, InvocationContext} from "@azure/functions"

async function html(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`)

    const name = request.query.get('name') || await request.text() || 'world'
    const ipAddress = request.headers.get('x-forwarded-for') || request.query.get("ip") || 'not available';
    return {body: `Hello, ${name}!\n\nYour IP is ${ipAddress}`}
}

app.http('html', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: "page/{pageId:alpha}/html",
    handler: html,
})
