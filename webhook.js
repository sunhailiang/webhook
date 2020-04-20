let http = require("http")
let crypto = require('crypto')
let { spawn } = require("child_process") // 获取子线程
let secret = "6239528"
// 加密签名算法
function sign (body) {
  return `sha1` + crypto.createHmac('sha1', secret).update(body).digest("hex")
}
let server = http.createServer(function (req, res) {
  console.log("webhook req", req.method, req.url);
  if (req.method == 'POST' && req.url == '/webhook') {
    let buffers = []
    req.on("data", function (buffer) {
      buffers.push(buffer)
    })

    req.on('end', function (buffer) {
      let body = Buffer.concat(buffer)
      let event = req.headers["x-github-event"]; // event类型我们选的push
      let signature = req.headers['x-hub-signature'] // 校验签名
      if (signature !== sign(body)) {
        return res.end("Not Allowed")
      }
      res.setHeader("Content-Type", "application/json")
      res.end(JSON.stringify({ ok: true }))
      // 如果是代码推送就开始部署
      if (event == 'push') {
        let payload = JSON.parse(body)
        let child = spawn('sh', [`./${payload.repository.name}.sh`])
        let buffers = [];
        child.stdout.on("data", function (buffer) {
          buffers.push(buffer)
        })
        child.stdout.on("end", function (buffer) {
          let logs = buffer.concat(buffers)
          console.log("拿到推送日志me？", logs);

        })
      }
    })

  } else {
    res.end("Not Found")
  }

})
server.listen(3002, () => {
  console.log("webhook服务于3002端口启动");
})