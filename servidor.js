const { log } = require("console")
const { Socket } = require("engine.io")
const express = require("express")

const app = express()

const servidor = require("http").Server(app)

const io = require("socket.io")(servidor)

let mensagens = []

app.use(express.static(__dirname+"/public"))
app.set("views", __dirname + "/public")
app.engine("html",require("ejs").renderFile)

const port = 9000
servidor.listen(port, ()=>{
    console.log("Conectado na porta" + port);
})

app.get("/",(req,res)=>{
    res.render("index.html")
})

app.get("/admin",(req,res)=>{
    res.render("admin.html")
})


io.on("connection",(socket)=>{
    socket.on("chat msg", (data)=> {
        mensagens.push(data)
        io.emit("chat msg", data)
    })
    mensagens.forEach((data)=>{
        socket.emit("chat msg",data)
    })

    //remover mensagens
    socket.on("apagar",(data)=>{
        console.log("n recebido" + data)
        mensagens = mensagens.slice(data)
        io.emit('recarregar',"true")
    })
    socket.on("numero-mensagens",(data)=>{
        var quantidade = mensagens.length
        socket.emit("numero-mensagens",quantidade)
    })

})