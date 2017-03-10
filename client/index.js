function getAuthorizeURL() {
  const result = document.getElementById('result');
  result.innerHTML = 'Waiting...';
  const req = new XMLHttpRequest();
  req.addEventListener('load', () => {
    result.innerHTML = `
      <a target="_blank" href=${req.responseText}>
        Click here to log in
      </a>
    `;
  })
  req.open('GET', '/get-url');
  req.send();
}
