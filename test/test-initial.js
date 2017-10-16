const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {app, server} = require('../server');

chai.use(chaiHttp);

describe('initial web page', function() {

	after(function() {
		return process.exit();
	});

	it('should return a 200 status code and HTML when root URL accessed', function() {
		return chai.request(app)
			.get('/')
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.html;
			});
	});
});