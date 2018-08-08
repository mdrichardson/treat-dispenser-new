# Treat Dispenser and Web App

This is a progressive web app used to control the Particle Photon treat dispenser in this repo. The treat dispenser dispenses treats based off of input from a progressive web app, time intervals, and or feeding schedule. The dispenser, itself, is based loosely off of [this model.](https://www.thingiverse.com/thing:27854)

This is a major overhaul of [my old Treat Dispenser repo](https://github.com/mdrichardson/treat-dispenser-old).

## Stack

* MEAN - MongoDB, Express, Angular 6, Node.js
  * Mongoose
  * jsonwebtoken and angular-jwt

## Improvements Over Old Repo

* Uses Node.js/Express/MongoDB back end instead of deprecated Auth0 or Basic Authentication
* Works in Chrome, Edge, and IE (despite using CSS Grid and a lot of things IE hates)
* Completely self-hosted and solid greenlock SSL
* Added lots of additional scheduling settings
* Much better and more streamlined functions dealing with time
* Time-picker works much better than previous
* Animations
* More "advanced" JavaScript usage (Observables/rxjs, template strings, ternaries, switches, arrow functions, etc)
* SASS instead of plain CSS

### More Website and Photon Details

You can view additional details for the website and Photon (hardware) found in the READMEs here:

* [Website - /src folder](https://github.com/mdrichardson/treat-dispenser-new/tree/master/src)
* [Photon - /photon folder](https://github.com/mdrichardson/treat-dispenser-new/tree/master/photon)

### Installation

#### Front end

```
git clone https://github.com/mdrichardson/treat-dispenser-new
cd treat-dispenser
npm install
ng serve
```

### Back end

[Install MongoDB](https://docs.mongodb.com/manual/installation/), then:

```
cd ./server
npm install
node server
```

### Photon

1. Flash the [.ino file](https://github.com/mdrichardson/treat-dispenser-new/blob/master/photon/TreatDispenser.ino) to the Photon
2. Wire the photon in accordance with [this diagram](https://github.com/mdrichardson/treat-dispenser-new/blob/master/photon/treat-dispenser-photon.png)
3. Plug it in
4. Be sure to set your Device ID and Access Key in MongoDB
