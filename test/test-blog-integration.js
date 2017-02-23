const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const {BlogPost} = require('../models');
const {app, runServer, closeServer} = require('..server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);


function seedBlogData(){
	console.info('seeding blog data');
	const seedData = [];

	for(let i=1; i<=10; i++){
		seedData.push({
			author: {
				firstName: faker.name.firstName(),
				lastName: fake.name.lastName()
			},
			title: faker.title.sentence(),
			content: faker.lorem.text()
		});
	}
	return BlogPost.insertMany(seedData);
}

describe ('blog posts API resource', function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function(){
		return seedBlogData();
	});

	afterEach(function(){
		return tearDownDb();
	});

	after(function(){
		return closeServer();
	});


	describe('GET endpoint', function(){
		it('should return all existing blog posts', function(){

		let res;
		return chai.request(app)
		.get('/posts')
		.then(function(_res){
			res = _res;
			res.should.have.status(200);
			res.body.posts.should.have.length.of.at.least(1);
			return BlogPost.count();
			})
		.then(function(count){
			res.body.posts.should.have.length.of(count);
			});
		});

		it('should return blogs with right fields', function(){

			let resBlogPost;
			return chai.request(app)
			.get('/posts')
			.then(function(res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.posts.should.be.a('array');
				res.body.posts.should.have.length.of.at.least(1);

				res.body.posts.forEach(function){
					posts.should.be.a('object');
					post.should.include.keys('title', 'content', 'author');
				});
			resBlogPost = res.body.posts[0];
			return BlogPost.findById(resBlogPost.id);
			})
		.then(function())
		})
	})
})












