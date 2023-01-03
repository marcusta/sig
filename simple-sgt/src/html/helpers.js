function wrapDoc(title, content) {
  let html = `<!DOCTYPE html>
  <html><head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sweden Indoor Golf - Simplified Simulator Golf Tour</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma-rtl.min.css"></head>
  <body>
  <nav class="navbar is-fixed-top is-link has-shadow" role="navigation" aria-label="main navigation" style="background-color: rgb(0, 107, 164)">
  <div class="navbar-brand">
    <a class="navbar-item" href="/players">
      <img src="/img/sig_logo_small.png" width="40" height="40">
      <span style="margin-left: 15px;font-size: 1.5rem; font-weight: bold; color: white">Sweden Indoor Golf - Simple SGT</span>
    </a>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu">
    <div class="navbar-start">

    <div class="navbar-end">
      <div class="navbar-item">
      </div>
    </div>
  </div>
</nav>
  <section class="section" style="margin-top: 50px">
  <div class="container box">
  <h1 class="title is-1">${title}</h1>
  ${content}
  </body></html>`;
  return html;
}
exports.wrapDoc = wrapDoc;
function formField(label, name, value) {
  return `<div class="field">
    <label for="${name}" class="label">${label}:</label>
    <div class="control">
      <input class="input is-primary" type="text" id="${name}" name="${name}" value="${value}">
    </div>
  </div>`;
}
exports.formField = formField;
function submitButton(label) {
  return `<input class="button is-link" type="submit" value="${label}">`;
}
exports.submitButton = submitButton;
