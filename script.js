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
let keyboardToNotesSettings = new Map([
  ["a", "C4"],
  ["s", "D4"],
  ["d", "E4"],
  ["f", "F4"],
  ["g", "G4"],
  ["h", "A4"],
  ["j", "B4"],
]);
// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: which octave you're playing in, or whether a drone is on.
let octaveState = 4;
let index = 0;

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // instrument 1
const synthAM = new Tone.PolySynth(Tone.AMSynth).toDestination(); // instrument 2
const synthMONO = new Tone.PolySynth(Tone.MonoSynth).toDestination(); // instrument 3
const synthFM = new Tone.PolySynth(Tone.FMSynth).toDestination(); // instrument 4

//Setting the defualt to the notes of Mode1
const Instruments = [synth, synthAM, synthMONO, synthFM];

let recording = false;
let recordedNotes = [];
let isPlaying = false;

// ---------- Controls ----------
// Runs every time a key goes down.

// reusable function
const _octaveUpdate = function (octaveEvent) {
  const octaveAddSub = (command) => {
    switch (command) {
      case "o":
        return -1;
      case "i":
        return +1;
      default:
        return 0;
    }
  };

  octaveState = (octaveState + octaveAddSub(octaveEvent.key)) % 5;
  octaveState += !octaveState; // !!! ensures non zero and usigned numbers

  keyboardToNotesSettings.forEach((note, kKey) => {
    keyboardToNotesSettings.set(kKey, note.slice(0, -1) + octaveState);
  });
};

function keyDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
  //Checking for the octave buttons thus enabling an octave change

  // Holding a key down sends keydown again and again. Only react to the first one.
  if (event.repeat === false) {
    let currentNote = keyboardToNotesSettings.get(event.key);
    console.log("Key down:", event.key);
    console.log("Current Note:", currentNote);
    _octaveUpdate();

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

  if (typeof keyNote !== "undefined") {
    for (const instrument of Instruments) {
      for (let i = 1; i <= 4; i++) {
        instrument.triggerRelease(
          keyNote.toString().slice(0, -1) + i,
          Tone.now(),
        );
      }
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
