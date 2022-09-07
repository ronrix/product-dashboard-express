$(document).ready(() => {
	const socket = io.connect();

	socket.emit("test");
	socket.on("test", (msg) => {
		console.log(msg.msg);
	})
});