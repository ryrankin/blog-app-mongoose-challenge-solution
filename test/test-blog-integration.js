const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const {BlogPost} = require('../models');
const {DATABASE_URL} = require('../config');
const {app, runServer, closeServer} = require('../server');
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
			return BlogPost.findById(resBlogPost.id).exec();
			})
		.then(function(blogpost){

			resBlogPost.title.should.equal(blogpost.title);
			resBlogPost.content.should.equal(blogpost.content);
			resBlogPost.author.should.equal(blogpost.authorName);
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

				res.body.id.should.not.be.null;
				res.body.title.should.equal(newBlogpost.title);
				res.body.content.should.equal(newBlogpost.content);
				res.body.author.should.equal(
					`${newBlogpost.author.firstName} $newBlogpost.author.lastName`);
				return BlogPost.findById(res.body.id).exec();

			})
			.then(function(blogpost){
				blogpost.title.should.equal(newBlogpost.title);
				blogpost.content.should.equal(newBlogpost.content);
				blogpost.author.firstName.should.equal(newBlogpost.author.firstName);
				blogpost.author.lastName.should.equal(newBlogpost.author.lastName);
			});
		});
	});

	describe('PUT endpoint', function(){
		it('should update fields sent', function(){
			const updateData = {
				title: "test blog title here",
				content: "test content for blog is right here",
				author: {
					firstName: 'ryan',
					lastName: 'rankin'
				}
			};

			return BlogPost
				.findOne()
				.exec()
				.then(function(blogpost){
					updateData.id = blogpost.id;

					return chai.request(app)
						.put(`/posts/${blogpost.id}`)
						.send(updateData);
				})

				.then(function(res){
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.title.should.equal(updateData.title);
					res.body.author.should.equal(
						`${updateData.author.firstName} ${updateData.author.lastName}`);
					res.body.content.should.equal(updateData.content);

					return BlogPost.findById(updateData.id).exec();
				})
				.then(function(blogpost){
					blogpost.title.should.equal(updateData.title);
					blogpost.content.should.equal(updateData.content);
					blogpost.author.firstName.should.equal(updateData.author.firstName);
					blogpost.author.lastName.should.equal(updateData.author.lastName);
				});
			});
		});


	describe('DELETE endpoint', function(){
		it('delete a blogpost by id', function(){

			let blogpost;

			return BlogPost
			.findOne()
			.exec()
			.then(function(_blogpost){
				blogpost = _blogpost;
				return chai.request(app).delete(`/posts/${blogpost.id}`);
			})
			.then(function(res){
				res.should.have.status(204);
				return BlogPost.findById(post.id).exec();
			})
			.then(function(_blogpost){
				should.not.exist(_blogpost);
			});
		});
	});
});












