# Stateless Microservice App

This is a simple stateless microservice in Nodejs, Built with Node.js, Express and Mocha, having three major functionalities -

 * Authentication
 * JSON patching
 * Image Thumbnail Generation


## Setup

The API requires [Node.js](https://nodejs.org/en/download/)

To get up and running: 

**1.** Clone the repo.
```
git clone https://github.com/johnchristotle/stateless-microservice-app.git
```

**2.**  ```cd``` into repo. Use your own directory name eg cd my-directory-name OR
Use the same directory name(below) if you do not change it.
```
cd stateless-microservice-app
```

**3.**  Setup the application by installing its dependencies located at the ```package.json``` file with
```
npm install
```

**4.**  NOTE: The app gets up and running on port 3000 with ```npm start```.

**5.**  **Very Important!** Create a ```.env``` file and set ```jwtSecret``` to any secret phrase you want.
 

## Testing the API routes.

This is an API with post and patch requests, so we will be testing with [Postman](https://www.getpostman.com/)

### Function 1. Authentication
This is a mock authentication so you can pass in any username or password to login.
 1. Set the request to **POST** and the url to _/api/users/login_. 
 2. In the **Body** for the Postman request, select **x-www-form-urlencoded**.
 3. You will be setting 2 keys (for username and password). Set the ```username``` key to any name. Set ```password``` to any password (minimum of 6 characters).
 4. Hit ```Send```. You will get a result in this format:
 ```
 {
    "user": "christotle",
    "authorized": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vaSIsImlhdCI6MTUzMjAwNDkwMSwiZXhwIjoxNTMyMDI2NTAxfQ.sonItbpZ_yKsRLDXNfDqwN6yN5VbdMVDhgKAMxDmPFY"
}
 ```


 ### Function 2. JSON patching
Apply json patch to a json object, and return the resulting json object.
 1. Set the request to **PATCH** and the url to _/api/patch-object_.
 2. Set the key ```jsonObject``` to an object you would like to patch. Set the key ```jsonPatchObject``` to the object you want to use to patch the ```jsonObject```.
 ```
 Examples:
 jsonObject
 { "user": { "firstName": "Rose", "lastName": "Leonard" } }

 jsonPatchObject
 [{"op": "replace", "path": "/user/firstName", "value": "Christotle"}, {"op": "replace", "path": "/user/lastName", "value": "Agholor"}]
 ```
 3. Since this is a secure route, for testing, you will also have to set the token in the ```Header```. Set key as ```token``` and value as token you received from **Authentication**.
 4. Expected result should be:
 ```
 { "user": { "firstName": "Christotle", "lastName": "Agholor" } }
 ```


 ### FUnction 3. Image Thumbnail Generation
This request contains a public image URL. It downloads the image, resizes to 50x50 pixels, and returns the resulting thumbnail.
 1. Set the request to **POST** and the url to _/api/create-thumbnail_.
 2. Set the key ```imageUrl``` to a public image url.
 3. Since this is a secure route, for testing, you will have to set the token in the ```Header```. Set key as ```token``` and value as token you received from **Authentication**.
 4. Image will be downloaded and converted to a thumbnail of size 50x50 pixels with a sample result as below:
 ```
 {
    "converted": true,
    "user": "christotle",
    "success": "Image has been resized",
    "thumbnail": "./public/images/resized/"
}
```


## Unit Testing

Unit testing is done using mochai.

Run ```npm test``` from the application's root directory.

## Logging

All logs are saved in ```hackerbay.log``` in the application's root.


## Built With

 * [Node.js](https://nodejs.org)
 * [Express](https://expressjs.com/)
 * [Mocha](https://mochajs.org/) - For testing


## Known Issues

 1. Test for thumbnail generation with [Mocha](https://mochajs.org/) _'it should accept a public image url and return a resized image'_ returns a promise which is currently not being handled properly.
 2. _Dockerfile_ has not been fully tested.
 3. _Istanbul_ coverage not working as expected...
