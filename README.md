###### DEMO
[http://nodestrap.herokuapp.com/](http://nodestrap.herokuapp.com/)

# NodeStrap

NodeStrap is a Front-end / Back-end template using AngularJS, Twitter Bootstrap ,MongoDB and NodeJS with authentication system for building and deploy (Heroku ready) NodeJS apps in seconds.

## Prerequisites
* NodeJS 0.10.x
* MongoDB


## Quick start

Clone the git repo - `git clone https://github.com/hugodias/nodestrap.git` - or [download it](https://github.com/hugodias/nodestrap/zipball/master)

Go to your nodeStrap folder and run npm
<pre>
npm install
</pre>

Change your server API URL at `public/javascripts/services/user_services.js`
<pre>var parseURL = "http://nodestrap.herokuapp.com/api";</pre>

Start MongoDB
<pre>mongod</pre>

Run nodeJS
<pre>node app.js</pre>

Check at [http://localhost:5000](http://localhost:5000)

You can try loggin in with `admin / admin`

## Features

##### [AngularJS](http://angularjs.org/)

##### [Twitter Bootstrap](http://twitter.github.com/bootstrap/index.html)

##### [MongoDB (Mongoose)](http://www.mongodb.org/)

##### [NodeJS 0.10.x](http://nodejs.org/)
* Security Authentication system
* Users CRUD
* Ready for Heroku deploy


#### Todo
---

* Include supports for redis and mysql / postgres
* Create a feature to remind the user password

## License

### Major components:

* jQuery: MIT/GPL license
* Twitter bootstrap: [Apache License, Version 2.0 (the "License")](http://www.apache.org/licenses/LICENSE-2.0)

### Everything else:

The Unlicense (aka: public domain)