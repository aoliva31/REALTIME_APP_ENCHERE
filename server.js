// ==========  server.js ==============
// Requirements
const mongoose = require('mongoose')
const express = require('express')
const formidableMiddleware = require('express-formidable');
const AdminBro = require('admin-bro')
const AdminBroExpressjs = require('admin-bro-expressjs')
var Schema = mongoose.Schema;

// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(require('admin-bro-mongoose'))

// express server definition
const app = express()
app.use(formidableMiddleware());

// Resources definitions
const User = mongoose.model('Utilisateurs', {nom_prenom: String, role: String, adresse: String, email: String, password: String, cb_data: String })
//const Encheres = mongoose.model('Produits', {nom_article: String, description: String, prix: String, email: String, password: String, cb_data: String })

var schema = new Schema(
    {
      name: String,
      binary: Buffer,
      living: Boolean,
      updated: { type: Date, default: Date.now() },
      age: { type: Number, min: 18, max: 65, required: true },
      mixed: Schema.Types.Mixed,
      _someId: Schema.Types.ObjectId,
      array: [],
      ofString: [String], // You can also have an array of each of the other types too.
      nested: { stuff: { type: String, lowercase: true, trim: true } }
    })


// Routes definitions
app.get('/', (req, res) => res.send('Hello World!'))

// Route which returns last 100 users from the database
app.get('/users', async (req, res) => {
  const users = await User.find({}).limit(10)
  res.send(users)
})

// Route which creates new user
app.post('/users', async (req, res) => {
  const user = await new User(req.fields.user).save()
  res.send(user)
})

// Pass all configuration settings to AdminBro
const adminBro = new AdminBro({
  resources: [User],
  rootPath: '/admin',
})

// Build and use a router which will handle all AdminBro routes
const router = AdminBroExpressjs.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router)

// Running the server
const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })
  await app.listen(8080, () => console.log(`listen sur le port 8080!`))
}

run()