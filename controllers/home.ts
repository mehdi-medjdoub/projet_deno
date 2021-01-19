import * as path from "https://deno.land/std@0.82.0/path/mod.ts";

export const home = ({ response }: { response: any }) => {
    response.status = 200
    response.body = 
    `<!DOCTYPE html>
    <html>
        <body>
        <h1>Page d'accueil deno project</h1>
        </body>
    </html>`
    //response.sendFile(new TextEncoder().encode("<h1>Hello World</h1>\n"));
}

export const notfound = ({ response }: { response: any }) => {
    response.status = 404
    response.body = 
    `
    <!DOCTYPE html>
    <html lang="en">
    <body>

        <div id="notfound">
            <div class="notfound">
                <div class="notfound-404">
                    <h1>4<span>0</span>4</h1>
                </div>
                <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                <a href="http://localhost:8000/">home page</a>
            </div>
        </div>
    </html>
    `
    //response.sendFile(new TextEncoder().encode("<h1>Hello World</h1>\n"));
}
