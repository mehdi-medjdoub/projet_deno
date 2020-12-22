import * as path from "https://deno.land/std@0.82.0/path/mod.ts";

export const home = ({ response }: { response: any }) => {
    response.status = 200
    response.body = `<!DOCTYPE html>
    <html>
        <body>
        <h1>denojs c'est nul</h1>
        </body>
    </html>`
    //response.sendFile(new TextEncoder().encode("<h1>Hello World</h1>\n"));
}

export const notfound = ({ response }: { response: any }) => {
    response.status = 404
    response.body = `<!DOCTYPE html>
    <html>
        <body>
        <h1>error 404</h1>
        </body>
    </html>`
    //response.sendFile(new TextEncoder().encode("<h1>Hello World</h1>\n"));
}
