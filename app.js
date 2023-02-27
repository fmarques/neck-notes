const $neck = document.getElementById('neck');

const handleInstrumentSelect = (elm) => {
  const instrument = elm.value;

  if (instrument === 'bass') {
    $neck.classList.add('bass')
    $neck.classList.remove('guitar')
  }
  else {
    $neck.classList.add('guitar')
    $neck.classList.remove('bass')
  }
}

const handleFretSelect = (elm) => {
  const fretNum = elm.value;

  removeClassByPrefix($neck, 'fret')

  $neck.classList.add('fret'+fretNum)
}

const handleFlipHorizontal = (elm) => {
  elm.checked ? $neck.classList.add('flip-h') : $neck.classList.remove('flip-h');
}

const handleFlipVertical = (elm) => {
  elm.checked ? $neck.classList.add('flip-v') : $neck.classList.remove('flip-v');
}

const handleFlatSelect = (elm) => {
  elm.checked ? $neck.classList.add('flat') : $neck.classList.remove('flat');
}

const handleNaturalSelect = (elm) => {
  elm.checked ? $neck.classList.add('natural') : $neck.classList.remove('natural');
}

const handleSharpSelect = (elm) => {
  elm.checked ? $neck.classList.add('sharp') : $neck.classList.remove('sharp');
}

const handleTunningSelect = (elm) => {
  getTunning(elm.value)
}

const getNotes= async () => {
  const res = await fetch(`./json/notes.json`)
  const data = await res.json()

  return data
}

const parseNote = (fret) => {
  const $span = document.createElement('span');

  fret.forEach(function (item, i) {
    const $subSpan = document.createElement('span');
    $subSpan.classList.add(item.type);
    $subSpan.append(item.note)

    $span.append($subSpan)
    $span.classList.add('wrap-'+item.type);
  })
  
  return $span
}
const notesOnString= (note, notesArr) => {

  const noteIndex = itemIndex(notesArr, note)
  let endArr = []
  let startArr = []

  notesArr.filter((elm, i) => {

    if (i<noteIndex) {
      endArr.push(elm)
    }
    else {
      startArr.push(elm)
    }
  })

  return [...startArr, ...endArr];
}

const getTunning = async (tunning) => {
  const res = await fetch(`./json/${tunning}.json`)
  const data = await res.json()
  const notesArr = await getNotes() 
  
  let stringsArr = []

  data.forEach(function (string, i) {
    stringsArr.push(notesOnString(string.note, notesArr))
  })

  buildFreatboard(stringsArr)
}

const buildFreatboard = (stringsArr) => {
  const $fretBoard =  document.createElement('div');
  const $fretNumbers =  document.createElement('div');
  $fretBoard.classList.add('fretboard');
  $fretNumbers.classList.add('fret-numbers');

  stringsArr.forEach(function (string, i) {
    let l = 0;
    let k = 0;

    const $string =  document.createElement('div');
    $string.classList.add('string');

    while (l < 2) {

      string.forEach(function (fret, j) {
        const $fret = document.createElement('div');
        const $span = document.createElement('span');
  
        const $note = parseNote(fret)
  
        $fret.classList.add('fret');
        
        $fret.append($note)
        $string.append($fret)
  
        if (i === 0) {
          $span.classList.add('fret');
          $span.append(k);
          $fretNumbers.append($span)
        }
        k++;
      })
      l++;
  }
    $fretBoard.append($string)
  });

  $neck.textContent = '';
  $neck.append($fretNumbers)
  $neck.append($fretBoard)
}

function removeClassByPrefix(el, prefix) {
  var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
  el.className = el.className.replace(regx, '');
  return el;
}

function itemIndex(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].length === 1) {
      if (item === array[i][0].note) {
        return array.indexOf(array[i]);
      }
    } else {
      if (item === array[i][0].note || item === array[i][1].note) {
        return array.indexOf(array[i]);
      }
    }
  }
  return false;
}