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

				res.body.posts.forEach(function(blogpost){
					posts.should.be.a('object');
					post.should.include.keys('title', 'content', 'author', 'created');
				});
			resBlogPost = res.body.posts[0];
			return BlogPost.findById(resBlogPost.id);
			})
		.then(function(blogpost){

			resBlogPost.id.should.equal(blogpost.id);
			resBlogPost.title.should.equal(blogpost.title);
			resBlogPost.content.should.equal(blogpost.content);
			resBlogPost.author.should.equal(blogpost.author);
			resBlogPost.created.should.equal(blogpost.created);
		});
		});
	});


	describe('POST endpoint', function(){

		it('should add a new blogpost', function(){

			conts newBlogpost = generateBlogpostData();


			return chai.request(app)
			.post('/posts')
			.send(newBlogpost)
			.then(function(res){
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys(
					'id', 'title', 'content', 'author', 'created');

				res.body.id.should.equal(newBlogpost)
			})
		})
	})
})












