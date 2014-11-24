/**
 * Copy this file to the name options.js and change the values below to your preferences. The options.js file is in the
 * .gitignore file so that your sensitive information does not get committed to Git.
 */
"use strict";
module.exports = {
	server: {
		port    : 995,
		host    : 'pop.gmail.com',
		username: 'recent:testuser@gmail.com', // Change this
		password: 'YourPasswordHere' // Change this
	},
	client: {
		tlserrs  : false,
		enabletls: true,
		debug    : false
	}
};
