# Resume Destroyer

Resume review app built with Next.js.

## How It Works

- Resume PDFs are parsed in the browser.
- The extracted resume text is sent to a Next.js API route.
- The API route calls Groq using `GROQ_API_KEY` from the server environment.

## Local Development

Set `GROQ_API_KEY` in your environment, then run:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- End users do not need their own API key.
- Resume text is extracted in the browser and sent to your server route for review generation.
- `webpack` build works in this environment via `./node_modules/.bin/next build --webpack`.
- The current `yarn lint` command is still blocked by the installed ESLint 10 / Next lint stack mismatch and likely needs dependency reinstallation with a compatible ESLint version.
