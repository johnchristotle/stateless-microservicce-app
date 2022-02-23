const { expect } = require('chai')
const request = require('supertest')
const require = require("express-validation")

const app = require('../app')


describe('Christole Stateless Microservice', () => {
  // Create dummy login data
  const loginDetails = { username: 'christotle', password: 'winner' }
  // Create token variable to save user token
  let token
  // Set various variables to be used in the application
  const imageUrl = 'https://s3.amazonaws.com/oxfamamericaunwrapped.com/wp-content/uploads/2013/07/OAU10-53_pair_of_goats_2014-updated-image-400x400.jpg'
  const invalidImageUrl = 'https://s3.amazonaws.com/oxfamamericaunwrapped.com/wp-content/uploads/2013/07/OAU10-53_pair_of_goats'
  const jsonObject = '{ "user": { "firstName": "Rose", "lastName": "Leonard" } }'
  const jsonPatchObject = '[{"op": "replace", "path": "/user/firstName", "value": "Christotle"}, {"op": "replace", "path": "/user/lastName", "value": "Agholor"}]'

  // Mock user authentication
  describe('Mock Authentication', () => {
    it('it should not log user in if username and password do not meet requirements', (done) => {
      request.agent(app)
        .post('/api/users/login')
        .send({ username: 'christotle', password: '' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
          done()
        })
    })

    it('it should accept a username/password and return a signed JWT', (done) => {
      request.agent(app)
        .post('/api/users/login')
        .send(loginDetails)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body.authorized).to.equal(true)
          token = res.body.token
          done()
        })
    })
  })

  describe('Thumbnail creation', () => {
    it('it should accept a public image url and return a resized image', (done) => {
      request.agent(app)
        .post('/api/create-thumbnail')
        .set('token', token)
        .send({ imageUrl: imageUrl })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.body.converted).to.equal(true)
        })
      done()
    })

    it('it should not process image if token is invalid', (done) => {
      request.agent(app)
        .post('/api/create-thumbnail')
        .set('token', 'randomewwrongtoken')
        .send({ imageUrl: imageUrl })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401)
          expect(res.body.authorized).to.equal(false)
        })
      done()
    })

    it('it should not process image if url is invalid', (done) => {
      request.agent(app)
        .post('/api/create-thumbnail')
        .set('token', token)
        .send({ imageUrl: invalidImageUrl })
        .end((err, res) => {
          expect(res.statusCode).to.equal(400)
        })
      done()
    })
  })

  describe('Patch object', () => {
    it('it should patch object A with object B', (done) => {
      request.agent(app)
        .patch('/api/patch-object')
        .set('token', token)
        .send({ jsonObject, jsonPatchObject })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200)
          done()
        })
    })

    it('it should not patch if token is invalid', (done) => {
      request.agent(app)
        .patch('/api/patch-object')
        .set('token', 'randomewwrongtoken')
        .send({ jsonObject, jsonPatchObject })
        .end((err, res) => {
          expect(res.statusCode).to.equal(401)
          expect(res.body.authorized).to.equal(false)
        })
      done()
    })
  })
})