export function Page(body: string) {
  const result = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Create Course</title>
          <link href="http://localhost:4000/static/tailwind.css" rel="stylesheet">
          <script src="http://localhost:4000/static/htmx.js"></script>
      </head>
      <body class="bg-gray-100 p-10">
        ${body}
      </body>
    </html>
  `;
  return result;
}
