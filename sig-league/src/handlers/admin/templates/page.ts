export function Page(body: string, title = "Sweden Indoor Golf") {
  const result = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <link href="http://localhost:4000/static/tailwind.css" rel="stylesheet">
          <script src="http://localhost:4000/static/htmx.js"></script>
      </head>
      <body class="bg-gray-100 p-10">
        ${body}
        <script>
        // Function to parse URL query parameters
        function getQueryParam(param) {
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          return urlParams.get(param);
        }
      
        // Get refresh-interval from URL query parameter
        const refreshInterval = getQueryParam('refresh-interval');
      
        if (refreshInterval) {
          // If refresh-interval is found, set the timeout to refresh the page
          setTimeout(function() {
             window.location.reload();
          }, parseInt(refreshInterval, 10) * 1000);
        }
      </script>
           
      </body>
    </html>
  `;
  return result;
}
