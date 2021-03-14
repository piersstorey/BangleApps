
// Array of programmes
var programme = [
  {
  'set': 'Four finger warmup',
  'pocket': '4 finger deep',
  'fingers': '4 fingers',
  'hangSeconds': 3,
  'restSeconds': 10,
  'repetitions': 3,
  'setRestSeconds': 10,
  },
  {
  'set': '3 x Pull-ups',
  'pocket': 'Jugs',
  'fingers': '4 fingers',
  'hangSeconds': 5,
  'restSeconds': 10,
  'repetitions': 2,
  'setRestSeconds': 10,
  },
  {
  'set': '10 x Retractions',
  'pocket': 'Jugs',
  'fingers': '4 fingers',
  'hangSeconds': 7,
  'restSeconds': 10,
  'repetitions': 2,
  'setRestSeconds': 10,
  },
  {
  'set': '4 finger deadhang',
  'pocket': '4 finger deep',
  'fingers': '4 fingers',
  'hangSeconds': 4,
  'restSeconds': 10,
  'repetitions': 3,
  'setRestSeconds': 10,
  },
  {
  'set': '3 finger deadhang',
  'pocket': '3 finger deep',
  'fingers': 'Front 3',
  'hangSeconds': 4,
  'restSeconds': 10,
  'repetitions': 3,
  'setRestSeconds': 10,
  },
  {
  'set': '3 finger deadhang',
  'pocket': '3 finger deep',
  'fingers': 'Back 3',
  'hangSeconds': 3,
  'restSeconds': 10,
  'repetitions': 3,
  'setRestSeconds': 10,
  },
  {
  'set': 'Left sloper hang',
  'pocket': 'L sloper, R 4 finger',
  'fingers': 'Back 3',
  'hangSeconds': 4,
  'restSeconds': 10,
  'repetitions': 3,
  'setRestSeconds': 10,
  },
  {
  'set': 'Right sloper hang',
  'pocket': 'R sloper, L 4 finger',
  'fingers': 'Back 3',
  'hangSeconds': 3,
  'restSeconds': 10,
  'repetitions': 3,
  'setRestSeconds': 10,
  }
];

// Set programe length to be the same array len starting from 0
var ProgrammeLength = programme.length - 1;

// Set the set position
var setPos = 0;

// Create global startTime variable
var startTime = Date.now();

// Temp set 
// var set = programme[0];

// Display the set information
function showSet(value){
  
  return new Promise((resolve) => {
    
    let setName = "Set: " + value.set;
    let pocket = "Pocket: " + value.pocket;
    let fingers = "Fingers: " + value.fingers;
    let hangSeconds = "Hang Seconds: " + value.hangSeconds;
    let repetitions = "Repetitions: " + value.repetitions;
    setDescription = setName + '\n\n' + pocket + '\n' + fingers + '\n' + hangSeconds + '\n' + repetitions;
    g.clear();
    g.setFontAlign(-1,-1); // Default font alignment
    g.setFont("Vector",18);
    g.drawString(setDescription,10,50); 
    resolve(true);
    
  }); // return new Promise
}

// Display set repetition
function showRepetition(number, set){
  
  return new Promise((resolve) => {
    
    let repetitionNumber = 'Repetition : ' + number;
    let pocket = "Pocket: " + set.pocket;
    let fingers = "Fingers: " + set.fingers;
    let hangSeconds = "Hang Seconds: " + set.hangSeconds;

    let repetitionDesc = repetitionNumber + '\n' + pocket + '\n' + fingers + '\n' + hangSeconds;

    g.clear();
    g.setFontAlign(-1,-1); // Default font alignment
    g.setFont("Vector",20);
    g.drawString(repetitionDesc,10,50); 
    g.flip();
    resolve(true);
    
  }); // return new Promise

}

// Display end of set
function showSetEnd(){
  
  return new Promise((resolve) => {
    
  console.log('showSetEnd');
    
  let totalMinutes = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
    
  g.clear();
  g.setFontAlign(0,0); // center font
  g.setFont("Vector",30); // vector font, 30px 
  g.drawString('Set complete',120, 60);
  g.drawString('Minutes: ' + totalMinutes,120, 100); // Draw timer tex
  resolve(true);
    
  }); // return new Promise

}

// Timer function
const timer = (cnt, text) => {
  return new Promise((resolve, reject) => { 

    const intervalId = setInterval(() => {
      
      // If the countdown number is not zero, display
      if (cnt != 0) {
        g.clear(); // Clear the previous screen
        g.setFontAlign(0,0); // center font
        g.setFont("Vector",30); // vector font, 30px  
        g.drawString(text,120,60); // Draw timer text
        g.setFont("Vector",80); // vector font, 80px  
        g.drawString(cnt,120,120); // Draw count
        g.flip(); // Keep the watch LCD lit up
      }

      // Print out timer text
      console.log(text + ': ' +cnt);
      
      // Reduce the count by 1
      -- cnt;

      // If the count has reach zero, stop interval and return promise
      if (cnt < 0) {
        
        // Timer end double buzz
        clearInterval(intervalId);
        resolve(true);
        
      }
    }, 1000); // const intervalId = setInterval(()
    
  }); // return new Promise((resolve, reject)
};


// Function to iterate through set repetitions
const doNextRepetition = (d, set) => {
  
  console.log('doNextRepetition');
  
  return new Promise((resolve, reject) => {
    
    // Create an array of repetition hang seconds
    const repetitionArray = new           Array(set.repetitions).fill(set.hangSeconds);

    console.log('Repetition: ' + (d + 1));
    
    showRepetition(d+1, set)
      .then(() => new Promise(resolve => setTimeout(resolve,2000)))
      .then(() => Bangle.buzz())
      .then(() => timer(repetitionArray[d], 'Hang')
      .then(() => Bangle.buzz())
      .then(() => new Promise(resolve => setTimeout(resolve,100)))
      .then(() => Bangle.buzz())
      .then(() => timer(set.restSeconds, 'Rest')
      .then(() =>  { 
      d++;
      
      if (d < repetitionArray.length) {
        doNextRepetition(d, set);
      }
      else {
        console.log('Set Complete');
        
        if (setPos < ProgrammeLength){
          console.log('ProgrammeLength: ' + ProgrammeLength); 
          console.log('setPos: ' + setPos);
          setPos++;
          
          timer(set.setRestSeconds, 'Set Rest')
          .then(() => runSet(programme[setPos]));
        }
        else {
        showSetEnd();
        resolve(true);
        }
      }
      
      }))
    );
  }); // return new Promise((resolve, reject)
};

// Programme menu
var programmeMenu = {
  "" : {
    "title" : "-- Programmes --"
  },
  "Warm up" : function() { Bangle.beep(); },
  "Fingerboard" : function() { runProgramme(); },
  "Climb" : function() { Bangle.buzz(); },
  "Exit" : function() { E.showMenu(); },
};

// Run the programme set
function runSet(set) {
  
  // Display initial set information 
  showSet(set)
  .then(() => new Promise(resolve => setTimeout(resolve,3000)))
  .then(() => doNextRepetition(0, set)); 
  
}

// Primary function for running the programme
function runProgramme(){
  // Iterate through the programe sets
  E.showMenu(); // Clear previous menu
  g.flip();
  var startTime = Date.now();
  runSet(programme[setPos]);
}

// Display app menu
E.showMenu(programmeMenu);