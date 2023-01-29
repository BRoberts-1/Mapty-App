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

// Important to start a project with a planning phase before beginning in order to organize and prevent
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