exports.DATABASE_URL = 'mongodb://ryrankin:Mn7u5g5a223@ds157459.mlab.com:57459/mongo-blog-api' ||
						process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/blog-app';

exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL || 
	'mongodb://localhost/test-blog-app');

exports.PORT = process.env.PORT || 8080;