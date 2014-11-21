var POP3Client = require('poplib'),
	MailParser = require('mailparser').MailParser,
	dateFormat = require('dateformat');

var port     = 995,
	host     = 'pop.gmail.com',
	username = 'recent:testuser@gmail.com', // Change this
	password = 'YourPasswordHere'; // Change this

var totalMessages  = 0,
	currentMessage = 0;

var client = new POP3Client(port, host, {
	tlserrs  : false,
	enabletls: true,
	debug    : false
});

function handleMailData(mailObj){
	displayMail(mailObj);
	getNextMessage();
}

function displayMail(mailObj) {
	console.log("Date:", dateFormat(mailObj.date, 'fullDate'));
	console.log("From:", mailObj.from[0].address); // [{address:'sender@example.com',name:'Sender Name'}]
	console.log("Subject:", mailObj.subject); 
	//console.log("Text body:", mail_object.text); // How are you today?
	console.log('------------------------------------------------------------------------------------------');
}

var getNextMessage = function () {
	currentMessage++;
	if (currentMessage <= totalMessages) {
		client.retr(currentMessage);
	} else {
		console.log("****************** NO MORE MESSAGES ******************");
		client.quit();
	}
};

client.on("error", function (err) {
	if (err.errno === 111) console.log("Unable to connect to server");
	else console.log("Server error occurred");
	console.log(err);
});

client.on("connect", function () {
	console.log("CONNECT success");
	client.login('recent:standupbass@gmail.com', password);
});

client.on("invalid-state", function (cmd) {
	console.log("Invalid state. You tried calling " + cmd);
});

client.on("locked", function (cmd) {
	console.log("Current command has not finished yet. You tried calling " + cmd);
});

client.on("login", function (status, rawdata) {
	if (status) {
		console.log("LOGIN/PASS success");
		client.list();
	} else {
		console.log("LOGIN/PASS failed");
		client.quit();
	}
});

// Data is a 1-based index of messages, if there are any messages
client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
	if (status === false) {
		console.log("LIST failed");
		client.quit();
	} else {
		console.log("LIST success with " + msgcount + " element(s)");
		totalMessages = msgcount;
		if (msgcount > 0) {
			//console.log(data);
			getNextMessage();
		} else {
			client.quit();
		}
	}
});

client.on("retr", function (status, msgnumber, data, rawdata) {
	if (status === true) {
		console.log("RETR success for msgnumber " + msgnumber);
		var mailparser = new MailParser({});
		mailparser.on("end", handleMailData);
		mailparser.write(data);
		mailparser.end();
		//client.quit();
	} else {
		console.log("RETR failed for msgnumber " + msgnumber);
		client.quit();
	}
});

client.on("dele", function (status, msgnumber, data, rawdata) {
	if (status === true) {
		console.log("DELE success for msgnumber " + msgnumber);
		client.quit();
	} else {
		console.log("DELE failed for msgnumber " + msgnumber);
		client.quit();
	}
});

client.on("quit", function (status, rawdata) {
	if (status === true) {
		console.log("QUIT success");
	}
	else {
		console.log("QUIT failed");
	}
});
