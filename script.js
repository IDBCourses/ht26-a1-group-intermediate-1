/*
 * IDB Programming: A1 Modelling — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   controls — what happens when a key goes down or comes up
 *   setup    — starts everything
 *
 * There is no loop in this assignment. Nothing happens until the player presses
 * a key, and every key event follows the same two steps:
 *   1. update: change the state, based on which key it was
 *   2. use:    make sound from the state
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which key does what, which notes you can play, the tempo.

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: which octave you're playing in, or whether a drone is on.

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.

const showRecording = document.getElementById("show-recording");

const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // instrument 1
const synthAM = new Tone.PolySynth(Tone.AMSynth).toDestination(); // instrument 2
const synthMONO = new Tone.PolySynth(Tone.MonoSynth).toDestination(); // instrument 3
const synthFM = new Tone.PolySynth(Tone.FMSynth).toDestination(); // instrument 4

let octave = 4;
let keyboard = ['a', 's', 'd', 'f', 'g', 'h', 'j'];
let notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
let notesAlone = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let keyboardToNotes = new Map();
for (let index = 0; index < notes.length; index++) {
  keyboardToNotes.set(keyboard[index], notes[index]);
}

//Setting the defualt to the notes of Mode1
let index = 0;
const Instruments = [synth, synthAM, synthMONO, synthFM];

let recording = false;
let recordedNotes = [];
let isPlaying = false;

// ---------- Controls ----------
// Runs every time a key goes down.
function octaveUpdate(){
      for (let i = 0; i < notesAlone.length; i++) {
      notes[i] = notesAlone[i] + octave;
      console.log("Notes:", notes[i]);
    }

    for (let index = 0; index < notes.length; index++) {
      keyboardToNotes.set(keyboard[index], notes[index]);
      console.log("Keyboard to Notes:", keyboardToNotes.get(keyboard[index]));
    }
}

function keyDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
      //Checking for the octave buttons thus enabling an octave change

  // Holding a key down sends keydown again and again. Only react to the first one.
  if (event.repeat === false) {
    let currentNote = keyboardToNotes.get(event.key);
    console.log("Key down:", event.key);
    console.log("Current Note:", currentNote);

  if (event.key === "i") {
      octave = octave + 1;
      octaveUpdate();
      console.log("Octave Up:" + octave);
      //return;
    }
    //Checking for the octave buttons thus enabling an octave change
    else if (event.key === "o") {
      console.log("hello");
      octave = octave - 1;
      octaveUpdate();
      console.log("Octave Down:" + octave);
      //return;
    }

    // Press "8" to record
    if (event.key === "8") {
      recording = true;
      recordedNotes = [];
    }

    // save pressed note to array recordNotes
    if (recording === true && currentNote) {
      if (recordedNotes.length < 8) {
        recordedNotes.push(currentNote);
        console.log(recordedNotes);
        showRecording.innerHTML = `Your song:<br>${recordedNotes.join(" - ")}`;
      }
    }

    // stop recordning
    if (event.key === "9") {
      recording = false;
    }

    if (event.key === "0" && isPlaying === false && recordedNotes.length > 0) {
      isPlaying = true;
      for (let i = 0; i < recordedNotes.length; i++) {
        Instruments.at(index).triggerAttackRelease(
          recordedNotes[i],
          0.25,
          Tone.now() + i * 0.25,
        );
      }
      setTimeout(() => {
        isPlaying = false;
      }, recordedNotes.length * 250);
    }

    // Clear recording
    if (event.key === " ") {
      recording = false;
      recordedNotes = [];
      console.log("Recording cleared:", recordedNotes);
      showRecording.innerText = "";
    }

    //Checking for the mode buttons thus enabling an instrument
    if (parseInt(event.key) >= 1 && parseInt(event.key) <= 4) {
      index = parseInt(event.key) - 1;
    }
    if (currentNote) {
      Instruments.at(index).triggerAttack(currentNote, Tone.now());
    }
  }
}

// Runs every time a key comes up.
function keyUp(event) {
  let keyNote = keyboardToNotes.get(event.key);
  console.log("Current Note:", keyNote);
  console.log("Key up:", event.key);
  //This makes sure that the notes stop playing when lifted, and allows for swapping between instruments fluently
  // and makes sure that when a key is lifted, it will stop playing no matter the instrument it was initiated on.
  // If each instrument stopped in different ifs like they are initiatedthen swapping instruments could prevent a
  // note from stopping.

  if (keyNote) {
    for (const instrument of Instruments) {
      instrument.triggerRelease(keyNote, Tone.now());
    }
  }
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  // Put your event listener code here
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
}

setup(); // Always remember to call setup()!
