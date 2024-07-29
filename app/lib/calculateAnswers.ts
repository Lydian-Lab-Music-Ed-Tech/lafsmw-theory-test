export const checkAndFormat251Answers = (
  studentAnswers: string[],
  regexCorrectAnswers: RegExp[],
  nonRegexCorrectAnswers: string[],
  questionType: string
): string => {
  let score = 0;
  let formattedAnswers = "";

  for (let i = 0; i < regexCorrectAnswers.length; i++) {
    let chord = studentAnswers[i] || "";
    let isCorrect = regexCorrectAnswers[i].test(chord);
    if (isCorrect) {
      score++;
    }
    if (i % 3 === 0) {
      if (i !== 0) formattedAnswers += "</li>";
      formattedAnswers += "<li>";
    }
    formattedAnswers += isCorrect ? chord : `<b>${chord || "(No answer)"}</b>`;
    if (i % 3 !== 2) formattedAnswers += ", ";
  }

  formattedAnswers += "</li>";

  const result = `<b>${score}/${regexCorrectAnswers.length}</b> on the ${questionType} section.
    <ul>Actual student answers:
      ${formattedAnswers}
    </ul>
    <ul>Correct answers: ${nonRegexCorrectAnswers}</ul>`;

  return result;
};

export const checkAndFormatKeySigIdentifyAnswers = (
  answers: string[],
  correctAnswers: string[],
  questionType: string
): string => {
  let score = 0;
  let answersHTML = "";
  let keySigTextString = correctAnswers.join(", ");

  for (let i = 0; i < correctAnswers.length; i++) {
    let studentAnswer = answers[i] || "";
    let isCorrect =
      studentAnswer.toLowerCase() === correctAnswers[i].toLowerCase();

    if (isCorrect) {
      score++;
      answersHTML += `<li>${studentAnswer}</li>`;
    } else {
      answersHTML += `<li><b>${
        studentAnswer || "(No answer provided)"
      }</b></li>`;
    }
  }

  const result = `<b>${score}/${correctAnswers.length}</b> on the ${questionType} section.
    <ol>Actual student answers: ${answersHTML}</ol>
    <ul>Correct answers: ${keySigTextString}</ul>`;

  return result;
};

export const checkAndFormatChordIdentifyAnswers = (
  studentAnswers: string[],
  regexCorrectAnswers: RegExp[],
  nonRegexCorrectAnswers: string[],
  questionType: string
): string => {
  let score = 0;
  let studentAnswersHTML = "";
  let correctAnswers = nonRegexCorrectAnswers.join(", ");

  for (let i = 0; i < regexCorrectAnswers.length; i++) {
    let chord = studentAnswers[i] || "";
    let isCorrect = regexCorrectAnswers[i].test(chord);

    if (isCorrect) {
      score++;
      studentAnswersHTML += `<li>${chord}</li>`;
    } else {
      studentAnswersHTML += `<li><b>${
        chord || "(No answer provided)"
      }</b></li>`;
    }
  }

  const result = `<b>${score}/${regexCorrectAnswers.length}</b> on the ${questionType} section.
    <ol>Actual student answers:${studentAnswersHTML}</ol>
    <ul>Correct answers: ${correctAnswers}</ul>`;

  return result;
};

export const checkAndFormatArrOfArrsAnswers = (
  userAnswers: string[][],
  correctAnswers: string[][],
  questionType: string
): string => {
  let score = 0;
  let actualStudentAnswers = "";
  let correctHTMLAnswers = "";

  for (let i = 0; i < correctAnswers.length; i++) {
    if (!userAnswers[i] || !userAnswers[i].length) {
      actualStudentAnswers += `<li><b>(No answer provided)</b></li>`;
    } else {
      let isCorrect = true;
      let formattedUserAnswer = userAnswers[i]
        .map((answer, j) => {
          const userNote = answer.split("/")[0];
          const correctNote = correctAnswers[i][j];
          if (userNote !== correctNote) {
            isCorrect = false;
            return `<b>${userNote}</b>`;
          }
          return userNote;
        })
        .join(", ");

      if (isCorrect) score++;
      actualStudentAnswers += `<li>${formattedUserAnswer}</li>`;
    }

    correctHTMLAnswers += `<li>${correctAnswers[i].join(", ")}</li>`;
  }

  const result = `<b>${score}/${correctAnswers.length}</b> on the ${questionType} section.
    <ol>Actual student answers:${actualStudentAnswers}</ol>
    <ol>Correct answers:${correctHTMLAnswers}</ol>`;

  return result;
};

export const checkAndFormatChordAnswers = (
  userAnswers: string[][],
  correctAnswers: RegExp[],
  correctAnswersText: string[],
  questionType: string
): string => {
  let score = 0;
  let actualStudentAnswers = "";
  let correctAnswersString = correctAnswersText.join(", ");

  for (let i = 0; i < correctAnswers.length; i++) {
    if (!userAnswers[i] || !userAnswers[i].length) {
      actualStudentAnswers += `<li><b>(No answer provided)</b></li>`;
    } else {
      let answerString = userAnswers[i]
        .map((note) => note.split("/")[0])
        .join("");
      let isCorrect = correctAnswers[i].test(answerString);

      if (isCorrect) {
        score++;
        actualStudentAnswers += `<li>${answerString}</li>`;
      } else {
        actualStudentAnswers += `<li><b>${answerString}</b></li>`;
      }
    }
  }

  const result = `<b>${score}/${correctAnswers.length}</b> on the ${questionType} section.
    <ol>Actual student answers:${actualStudentAnswers}</ol>
    <ol>Correct answers: ${correctAnswersString}</ol>`;

  return result;
};
