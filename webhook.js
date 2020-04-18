let http = require("http")
http.createServer(function (req, res) {
  console.log("webhook req", req.method, req.url);
  if (req.method == 'POST' && req.url == '/webhook') {
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify({ ok: true }))
  } else {
    res.end("Not Found")
  }

})
http.listen(3002, () => {
  console.log("webhook服务于3002端口启动");
})