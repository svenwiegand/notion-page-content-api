import { parse } from "node-html-parser"

export async function embedExternalImages(html: string): Promise<string> {
    const root = parse(html)

    const imgTags = root.querySelectorAll('img')

    for (const img of imgTags) {
        const src = img.getAttribute('src')
        if (src && /^https?:\/\//.test(src)) {
            try {
                const response = await fetch(src)
                if (!response.ok) {
                    console.error(`Unable to retrieve image at "${src}": ${response.statusText}`)
                    continue
                }
                const buffer = Buffer.from(await response.arrayBuffer())
                const contentType = response.headers.get('content-type') ?? 'application/octet-stream'

                const base64 = buffer.toString('base64')
                const dataUrl = `data:${contentType};base64,${base64}`
                img.setAttribute('src', dataUrl)
            } catch (error) {
                console.error(`Unable to retrieve image at "${src}"`, error)
            }
        }
    }

    return root.toString()
}