const input = document.getElementById('input');
const output = document.getElementById('output');

const blockTypes = (line) => {

  let actualIndex = 0;
  let visualIndex = 1;

  const misplacedIndexes = [];
  const perfectIndexes = [];

  while (actualIndex < line.length) {
    switch (line.charCodeAt(actualIndex)) {
      // Dark mode:
      case 11035:
      // Light mode:
      case 11036:
        actualIndex += 1;
        visualIndex += 1;
        break;
      case 55357:
        switch (line.charCodeAt(actualIndex + 1)) {
          // High contrast:
          case 57318:
          // Regular contrast:
          case 57320:
            misplacedIndexes.push(visualIndex++);
            break;
          // High contrast:
          case 57319:
          // Regular contrast:
          case 57321:
            perfectIndexes.push(visualIndex++);
            break;
          default:
            return undefined;
        }
        actualIndex += 2;
        break;
      default:
        return undefined;
    }
  }

  return {
    misplacedIndexes: misplacedIndexes,
    perfectIndexes: perfectIndexes,
  };
}

const isGameLine = (line) => {
  return line && line.length > 0 && blockTypes(line) !== undefined;
}

const linePointsOrig = (line, index, totalCorrect) => {
    const correctPointsByRow = [];
    correctPointsByRow.push(12, 10, 8, 6, 4, 2);
    
    const partialPoints = 1;
    
    const decoded = blockTypes(line);
    
    let newCorrect = (decoded.perfectIndexes.length > totalCorrect) ?  (decoded.perfectIndexes.length - totalCorrect) : 0;

console.log('newCorrect: ' + newCorrect);
console.log('decoded.misplacedIndexes.length: ' + decoded.misplacedIndexes.length);
console.log('correctPointsByRow[index]*newCorrect: ' + correctPointsByRow[index]*newCorrect);

    let linePoints = correctPointsByRow[index]*newCorrect + decoded.misplacedIndexes.length;

    return [linePoints, newCorrect];
}

const linePointsCurrent = (line, index, totalCorrect) => {

    const correctPointsByRow = [];
    correctPointsByRow.push(17, 14, 11, 8, 5, 2);
  
    const rowBonuses = [];
    rowBonuses.push(15, 11, 8, 4, 2, 1);
  
    const partialPoints = 1;
  
    const decoded = blockTypes(line);
  
    let newCorrect = (decoded.perfectIndexes.length > totalCorrect) ?  (decoded.perfectIndexes.length - totalCorrect) : 0;
console.log('newCorrect: ' + newCorrect);
console.log('decoded.misplacedIndexes.length: ' + decoded.misplacedIndexes.length);
console.log('correctPointsByRow[index]*newCorrect: ' + correctPointsByRow[index]*newCorrect);

    //console.log('num eprfects: ' + decoded.perfectIndexes.length + ' newCorrect: ' + newCorrect + ' yellows: ' + decoded.misplacedIndexes.length);
    let rowBonus = 0;
    if (decoded.perfectIndexes.length == 5) {
      rowBonus = rowBonuses[index];
    }

    let linePoints = correctPointsByRow[index]*newCorrect + decoded.misplacedIndexes.length + rowBonus;

    return [linePoints, newCorrect];
}

const linePointsNew = (line, index, totalCorrect) => {

    const correctPointsByRow = [];
    correctPointsByRow.push(2, 2, 2, 2, 2, 2);

    const rowBonuses = [];
    rowBonuses.push(90, 80, 70, 60, 50, 40);

    const partialPoints = 1;

    const decoded = blockTypes(line);

    let newCorrect = (decoded.perfectIndexes.length > totalCorrect) ?  (decoded.perfectIndexes.length - totalCorrect) : 0;

    //console.log('num eprfects: ' + decoded.perfectIndexes.length + ' newCorrect: ' + newCorrect + ' yellows: ' + decoded.misplacedIndexes.length);
    let rowBonus = 0;
    if (decoded.perfectIndexes.length == 5) {
      rowBonus = rowBonuses[index];
    }

    let linePoints = correctPointsByRow[index]*newCorrect + decoded.misplacedIndexes.length + rowBonus;

    return [linePoints, newCorrect];

}

const calculatePoints = (lines, pointFunction) => {

    if (lines.length > 6) {
      console.log('Not calculating points. Too many result rows detected.');
      return 0;
    }

  let index = 0;
  let points = 0;
  let correctCount = 0;
  lines.forEach((line) => {
    if (correctCount < 5) {
      console.log('Calculating points for line index: ' + index + ' line: ' + line);
      let results = pointFunction(line, index, correctCount);
      console.log('line points: ' + results[0]);
      points += results[0];
      correctCount += results[1];
      console.log('correctCount: ' + correctCount);
      console.log('cumulative points: ' + points);
      index += 1;
    }
  });
  console.log('total points: ' + points);
  return points;
}


const render = () => {
  output.value = '';
  const lines = input.value.split('\n');
  const emojiLines = [];

  // Input textarea size limits crazy input, but add an arbitrary limit to results just in case
  if (lines.length > 10) {
    output.value = 'Too many lines in input';
  } else {
    lines.forEach((line) => {
      if (isGameLine(line)) {
        emojiLines.push(line);
      }
    });

    if (emojiLines.length > 6) {
      output.value = 'Incorrect number of result rows.';
    } else {
//      let points = calculatePoints(emojiLines, linePointsOrig);
//      let outputOrig = 'Total points for original scoring: ' + points;

//      points = calculatePoints(emojiLines, linePointsCurrent);
//      let outputCurr = 'Total points for current scoring: ' + points;

      let points = calculatePoints(emojiLines, linePointsNew);
      let outputNew = 'Total points for new scoring: ' + points;

//      output.value = outputOrig+'\n'+outputCurr+'\n'+outputNew+'\n';
      output.value = outputNew+'\n';
    }
  }
}


input.addEventListener('input', render);

