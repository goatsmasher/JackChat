var express = require("express")
var path = require("path")
var bp = require("body-parser")
var app = express()

var PORT = 8000
app.use(bp.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "./client")))
app.use(express.static(path.join(__dirname, "./server")))
app.use(express.static(path.join(__dirname, "./node_modules")))

app.set("views", path.join(__dirname, "./client/views"))
app.set("view engine", "ejs")


require("./server/config/routes.js")(app)

var server = app.listen(PORT, function () {
	console.log(`Listening on port ${PORT}`)
})
// **********************************************
if (!app.chatroom) {
	app.chatroom = []
}
app.nicknames = [];


var io = require("socket.io").listen(server)

io.sockets.on("connection", function (socket) {
	console.log("New connection", socket.id)

	socket.emit("update_chatroom", app.chatroom)

	socket.on("new_message", function (data) {
		app.chatroom.push({ name: socket.nickname, text: data.text });
		io.emit("update_chatroom", [app.chatroom[app.chatroom.length - 1]])
	})
	socket.on("new_user", function (data, callback) {
		if (app.nicknames.indexOf(data) != -1) {
			callback(false);
		}
		else {
			callback(true)
			socket.nickname = data;
			app.nicknames.push(socket.nickname);
			io.sockets.emit("usernames", app.nicknames)
		}
	})
	socket.on("disconnect", function (data) {
		if (!socket.nickname) {
			return;
		}
		else {
			app.nicknames.splice(app.nicknames.indexOf(socket.nickname), 1)
			io.sockets.emit("usernames", app.nicknames)
		}
	})

})