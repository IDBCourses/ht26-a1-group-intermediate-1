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
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // instrument 1
const synthAM = new Tone.PolySynth(Tone.AMSynth).toDestination(); // instrument 2
const synthMONO = new Tone.PolySynth(Tone.MonoSynth).toDestination(); // instrument 3
const synthFM = new Tone.PolySynth(Tone.FMSynth).toDestination(); // instrument 4

let octave = 4;

let newKeyboardToNotes = new Map([
  ["a", "C4"],
  ["s", "D4"],
  ["d", "E4"],
  ["f", "F4"],
  ["g", "G4"],
  ["h", "A4"],
  ["j", "B4"],
]);

//Setting the defualt to the notes of Mode1
const Instruments = [synth, synthAM, synthMONO, synthFM];
// ---------- Controls ----------
// Runs every time a key goes down.

// reusable function
const octaveUpdate = function (octaveEvent) {
  const octaveAddSub = (command) => {
    switch (command) {
      case "o":
        return -1;
      case "i":
        return +1;
      default:
        return 0;
    }
  }
  octave = Math.abs((octave + octaveAddSub(octaveEvent.key)) % 5);
  octave += !octave;

  newKeyboardToNotes.forEach((note, kKey) => {
    newKeyboardToNotes.set(kKey, note.slice(0, -1) + octave);
  });
};

function keyDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something
  //Checking for the octave buttons thus enabling an octave change

  // Holding a key down sends keydown again and again. Only react to the first one.
  if (event.repeat === false) {
    let currentNote = newKeyboardToNotes.get(event.key);
    console.log("Key down:", event.key);
    console.log("Current Note:", currentNote);
    octaveUpdate();

    //Checking for the mode buttons thus enabling an instrument
    if (parseInt(event.key) >= 1 && parseInt(event.key) <= 4) {
      var index = parseInt(event.key) - 1;
    }
    Instruments.at(index).triggerAttack(currentNote, Tone.now());
  }
}

// Runs every time a key comes up.
function keyUp(event) {
  let keyNote = newKeyboardToNotes.get(event.key);
  console.log("Current UPPED Note:", keyNote);
  console.log("Key up:", event.key);
  //This makes sure that the notes stop playing when lifted, and allows for swapping between instruments fluently
  // and makes sure that when a key is lifted, it will stop playing no matter the instrument it was initiated on.
  // If each instrument stopped in different ifs like they are initiatedthen swapping instruments could prevent a
  // note from stopping.

  // it returns in the browser console some weird dumb error of keyNote
  // not being defined
  for (const instrument of Instruments) {
    for (let i = 1; i <= 4; i++) {
      instrument.triggerRelease(
        keyNote.toString().slice(0, -1) + i,
        Tone.now(),
      );
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
