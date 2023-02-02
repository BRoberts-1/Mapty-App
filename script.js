'use strict';

// prettier-ignore

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
// We will never directly create a workout, rather we will just create a running or cycling object using the child classes below.
class Workout {
  date = new Date();
  /// All objects created should have a unique id and you will use a library to create these. They are very important. Here we will just use the current date using Date.now, convert to a string, and then use the last 10 numbers using .slice()
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // need an arrya of lat and long [lat, long]
    this.distance = distance; // in km
    this.duration = duration; // in minutes
  }

  _setDescription() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  

  this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // Pace is calculated by min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    // this.type = 'cycling';
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // method to calculate speed is km/hours
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
// to see if our classes are working properly
// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 523);
// console.log(run1, cycling1);

/////////////////////////////////////////////
// APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);

    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not acquire your position.');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude}, ${longitude}`);

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    // console.log(map); shows all methods from leaflet library - see docs

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // 1st step is to Empty inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    // 2nd step is to hide the display for the animation
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    // Below are helper function for testing complex conditions:
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    // Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // in modern JS if/else statements are not really used as much anymore, instead just use more than one 'if' statement
    // Another trend is using a guard clause(ie checking for the opposite, and the opposite it 'true' then you just return the function immediately)

    // Validate input from form(check if data is valid ie possible/usable in our situation)

    // If workout = running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check if the data is valid
      if (
        // if (!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence))
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers.');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout = cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers.');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    // Push/Add new object to workout array
    this.#workouts.push(workout);
    console.log(workout);

    // Render workout on map as marker
    // console.log(mapEvent);

    // Render workout onto our list of saved workouts
    this._renderWorkout(workout);

    // To display marker

    this._renderWorkoutMarker(workout);

    // Hide our form + clear input fields after submit
    this._hideForm();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
           <span class="workout__icon">${
             workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
           }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
        </li>`;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>`;

    form.insertAdjacentHTML('afterend', html);
  }
  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workout);
    // setView() is a method from leaflet library: 1st arg-coords, 2nd arg-zoom level, 3rd arg is object of options. We will create another private object field/propoerty called #mapZoomLevel above.
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }
}

const app = new App();

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
