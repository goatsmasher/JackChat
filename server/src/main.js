$(document).ready(function () {

    $("#chat_input").keydown(function () {
        if (event.which === 13) {

            if ($("#nm_name").val() == "" || $("#nm_text").val() == "") {
                alert("You cannot enter empty fields");
            }
            else {
                var nm = {};
                nm.name = $("#nm_name").val();
                nm.text = $("#nm_text").val();
                socket.emit("new_message", nm);
                $("#nm_text").val("");
                $("#nm_text").focus();
            }
        }
    });
    $("#setNick").submit(function () {

        socket.emit("new_user", $("#nickname").val(), function (data) {
            if (data) {
                $("#chatWrap").show();
                $("#nickWrap").hide();
            }
            else {
                $("#nickError").html("<h1 style=\"color:red\">" + "That username is already taken" + "</p>");
            }
        });

        $("#nickname").val("");
        return false;
    });
    var socket = io.connect();

    socket.on("update_chatroom", function (data) {
        var time = new Date();
        time = moment(time).format("h:mm:ss a");
        for (var i = 0; i < data.length; i++) {
            $("#chatroom").append("<p>" + "<span class=\"name_attr\">" + data[i].name + "</span>" + ": " + data[i].text + " - at " + time + "</p>");
        }
        scroll();
    });
    socket.on("usernames", function (data) {
        var log_users = "";
        for (var i = 0; i < data.length; i++) {
            log_users += "<span>" + data[i] + "</span>" + "<br>";
        }
        $("#chatroom").append("<p style=\"color:green\">**" + data[data.length - 1] + " has joined the chatroom**</p>");
        $("#current_users").html(log_users);
    });
    function scroll() {
        $("#chatroom").scrollTop($("#chatroom")[0].scrollHeight);
    }
});
