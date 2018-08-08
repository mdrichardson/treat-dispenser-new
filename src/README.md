# Treat Dispenser Web App

This is a progressive web app used to control the Particle Photon treat dispenser in this repo.

## Features

* Progressive - Can be "installed" on mobile phones
* User authentication via MEAN stack
* Works in Chrome, Edge, and IE (despite using CSS Grid and a lot of things IE hates)
* Fully secure with green lock
* Webcam display (using user authentication in MongoDB)
* Notifications for successful/failed interactions with Photon
* Treat Dispenser Function Control:
  * Treat dispense
  * Meal dispense
  * Debug: Make auger spin out
  * Debug: Make auger spin in
  * Debug: Make auger spin in then out until told to stop
  * Debug: Force stop the auger
  * Debug: Play "warning" tone
  * Debug: Execute testing function in Photon (I frequently changed the code of this function for quick testing)
* Requests variables from Treat Dispenser and auto-loads them in web app
* Treat Dispenser Variable Controls:
  * Treat Size, Meal Size
  * Toggle: Run continuously or only between Start and End Times
    * Interval Start Time, Interval End Time
    * Dispense Interval On/Off
    * Dispense Interval Time (hours:minutes)
  * Toggle: Scheduled Dispensing On/Off
    * Schedule Days
    * 3 different dispensing times and 2 different dispensing sizes for each time

## To Do

- [X] Make it work in IE and Edge
- [ ] Add special welcome messages for demo account

## Needs to be done, but won't be unless I pick the project back up

- [ ] Store variable values in web database and have Photon request them at startup
- [ ] Add websocket capability to Photon and app for faster communication
- [ ] Move all of the photon functions into the server for better security and for limiting demo requests