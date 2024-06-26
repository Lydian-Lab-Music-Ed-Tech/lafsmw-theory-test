export const check251Answers = (
  studentAnswers: string[],
  regexCorrectAnswers: RegExp[],
  questionType: string
): string => {
  let score = 0;
  let result = "";
  let numAnswers = studentAnswers.length;
  for (let i = 0; i < studentAnswers.length; i++) {
    let chord = studentAnswers[i];
    // console.log(`chord${i} from check251Answers:`, chord);
    // console.log(
    //   `regexCorrectAnswers[${i}] from check251Answers:`,
    //   regexCorrectAnswers[i]
    // );
    let isTrue = regexCorrectAnswers[i].test(chord);
    if (isTrue) {
      score++;
    }
  }
  result = `${score}/${numAnswers} on the ${questionType} section.
    <ul>Actual student answers:
      <li>${studentAnswers.slice(0, 3)}</li>
      <li>${studentAnswers.slice(3, 6)}</li>
      <li>${studentAnswers.slice(6, 9)}</li>
      <li>${studentAnswers.slice(9, 12)}</li>
      <li>${studentAnswers.slice(12, 15)}</li>
      <li>${studentAnswers.slice(15, 18)}</li>
    </ul>`;
  console.log("studentAnswers from check251Answers:", studentAnswers);
  return result;
};

export const checkKeySigIdentifyAnswers = (
  answers: string[],
  correctAnswers: string[],
  questionType: string
): string => {
  let score = 0;
  let result = "";
  let numAnswers = correctAnswers.length;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].toLowerCase() === correctAnswers[i]) {
      score++;
    }
  }
  result = `${score}/${numAnswers} on the ${questionType} section.
    <ul>Actual student answers:
      <li>${answers}</li>
    </ul>`;
  return result;
};

export const checkChordIdentifyAnswers = (
  studentAnswers: string[],
  regexCorrectAnswers: RegExp[],
  questionType: string
): string => {
  let score = 0;
  let result = "";
  let numAnswers = studentAnswers.length;
  for (let i = 0; i < studentAnswers.length; i++) {
    let chord = studentAnswers[i];
    let isTrue = regexCorrectAnswers[i].test(chord);
    if (isTrue) {
      score++;
    }
  }
  result = `${score}/${numAnswers} on the ${questionType} section.
    <ul>Actual student answers:
      <li>${studentAnswers}</li>
    </ul>`;
  return result;
};

export const checkArrOfArrsAnswer = (
  userAnswers: string[][],
  correctAnswers: string[][],
  questionType: string
): string => {
  let score = 0;
  let result = "";
  let numAnswers = correctAnswers.length;
  let actualStudentAnswers = convertStudentAnswersToHTML(userAnswers);
  for (let i = 0; i < userAnswers.length; i++) {
    if (!userAnswers[i].length) {
      continue;
    }
    if (checkArrNotesTrue(userAnswers[i], correctAnswers[i])) {
      score++;
    }
  }
  result = `${score}/${numAnswers} on the ${questionType} section.
    <ul>Actual student answers:${actualStudentAnswers}</ul>`;
  return result;
};

export const checkChordsAnswers = (
  userAnswers: string[][],
  correctAnswers: RegExp[],
  questionType: string
): string => {
  let score = 0;
  let result = "";
  let numAnswers = correctAnswers.length;
  let actualStudentAnswers = convertStudentAnswersToHTML(userAnswers);
  for (let i = 0; i < userAnswers.length; i++) {
    if (!userAnswers[i].length) {
      continue;
    }
    if (checkChordNotesRegexTrue(userAnswers[i], correctAnswers[i])) {
      score++;
    }
  }
  result = `${score}/${numAnswers} on the ${questionType} section.
    <ul>Actual student answers:${actualStudentAnswers}</ul>`;
  return result;
};

function checkArrNotesTrue(
  answers: string[],
  correctAnswers: string[]
): boolean {
  for (let i = 0; i < answers.length; i++) {
    let currentAnswer = answers[i].split("/")[0];
    if (currentAnswer !== correctAnswers[i]) {
      return false;
    }
  }
  return true;
}

function checkChordNotesRegexTrue(
  chordNotes: string[],
  correctChordNotes: RegExp
): boolean {
  let answerString = "";
  for (let i = 0; i < chordNotes.length; i++) {
    answerString += chordNotes[i].split("/")[0];
  }
  return correctChordNotes.test(answerString);
}

function convertStudentAnswersToHTML(userAnswers: string[][]): string {
  let result = "";
  for (let i = 0; i < userAnswers.length; i++) {
    for (let j = 0; j < userAnswers[i].length; j++) {
      userAnswers[i][j] = userAnswers[i][j].split("/")[0];
    }
    let current = userAnswers[i].join(", ");
    result += `<li>${i + 1}. ${current}</li>`;
  }
  return result;
}
