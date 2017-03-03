module.exports = function(app){
	app.get("/", function(req, res){
		res.render("index")
	})

	app.get("/current_chat", function(req, res){
		res.json({"counter": app.count})
	})

	// app.post('/new_message', function(req, res) {
	// 	app.chatroom.push({
	// 		name: req.body.name,
	// 		text: req.body.text
	// 	})
	// 	res.json({Status: "Okay"})
	// });
}