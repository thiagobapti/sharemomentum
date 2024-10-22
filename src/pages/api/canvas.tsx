export default function handler(req: any, res: any) {
  const {
    layout,
    backgroundColor = "red",
    width = 300,
    height = 500,
    text = "Hello",
  } = req.query;

  let dynamicContent = `<div>${text}</div>`;

  if (layout >= 2) {
    dynamicContent += "<div>Icon</div>";
  }
  if (layout >= 3) {
    dynamicContent += "<div>Text</div>";
  }

  const htmlShell = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Canvas Content</title>
    </head>
    <body>
      <div style="background-color: ${backgroundColor}; height: ${height}px; width: ${width}px;">
        ${dynamicContent}
      </div>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(htmlShell);
}
