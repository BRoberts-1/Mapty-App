'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Section 231 - Planning a project

// Important to start a project with a planning phase before beginning in order to organize and prevent future issues.

// 1. User Stories - A description of the applications functionality from the user's perspective. All user stories put together describe the entire application.
// 2. Features with user stories is a high level overview of the whole application that allows developers to develop the exact features to implement that are needed to make the user stories work as intended.
// 3. Flowchart - To visualize the different actions the user can take and how the program reacts to these actions
// 4. Architecture - How we will organize our code and what JS features we will use. Holds all the code together ie a structure to build inside the program's functionality. e.g. one giant folder, classes, functions, or multiple files or a mix of everything. We don't want spaghetti code.

// 1. USER STORIES - Description of the application's functionality from the user's perspective. Format: As a [type of user eg. user, admin, etc], I want to [an action] so that [benefit]
// eg. As a user, I want to log my running workout with location, distance, time, pace and steps/minute(aka cadence), so I can keep a log of all my running.
// Features: would be a map, or geolocation with location coordinates, and a form to input distance, time, pace, cadence
// As a user, I want to log my cycling workouts with location, distance, time, speed, and elevation gain, so I can keep a log of all my cycling.
// Features: same as above-geolocation with coordinates and a form to input distance, time, speed, and elevation gain
// As a user, I want to see all my workouts at a glance, so I can easily track my progress over time.
// Features: Display all workouts in a list which you can open
// As a user, I want to also see my workouts on a map, so I can easily check where I work out the most.
// Features: Display all workouts in a list
// As a user, I want to see all my workouts when I leave the app and come back later, so I can keep using the app over time.
// Features: Store workout data in browser using local storage API. Also, on page load, read the saved data from the local storage and display it on the map

// Whenever, building a flowchart start with events- page load, get current location coordinates using geolocation, render map on current location. Flowchart is broken up into yellow-actions, green-rendering, red-async events

// With flowchart and architecture you can always change it and develop it as you go. It doesn't have to be perfect.

//////////////////////
// Section 232 - Using the Geolocatin API

let map, mapEvent;
// To initialize:
if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude}, ${longitude}`);

      const coords = [latitude, longitude];

      map = L.map('map').setView(coords, 13);
      // console.log(map); shows all methods from leaflet library - see docs

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Handling clicks on map
      map.on('click', function (mapE) {
        mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
      });
    },
    function () {
      alert('Could not acquire your position.');
    }
  );

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // To clear imput fields after submit
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      '';

  // To display marker
  console.log(mapEvent);
  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup();
});

inputType.addEventListener('change', function () {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});

// Section 236 - Project Architecture
// Is this project we will use classes and objects mainly
// One of the most important decisions in architecture is to decide where and how to store the data. Data is the most fundamental part of any application.
//  In our user stories we need to store: location, distance, time, pace or speed, and step/min(cadence) or elevation gain. We will design our classes so that they can create objects that hold this data we specified.
// We will create a parent class called 'Workout' with id, distance, duration, coords(these are common to both child classes) date, and a constructor()
// We will create two child classes for their specific needs: 1. "Running" class with name, cadence, pace, and constructor() and 2. "Cycling" class with name, elevationGain, speed, and constructor()
// Usually OOP diagrams have properties on top and methods on bottom - see this section to see
// So far we have these events: load page, receive position through geolocation, click on map, change input, and submit form. Now we have to create functions for each-we will create a class "App" that will hold all these functions as methods.
// New objects will be created for each workout and then all the workouts will be stored in an array.
// If our app was bigger or more complex we could create a class that was concerned with the UI and then a class concerned with the business logic(ie the logic that works with the underlying data)
// We will have protected methods _getPosition()-load page, -loadMap(position)-receive position, _showForm() -click on map, _toggleElevationField() -change input, -newWorkout()-submit form
