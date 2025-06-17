export const checkAndFormat251Answers = (
  studentAnswers: string[],
  regexCorrectAnswers: RegExp[],
  nonRegexCorrectAnswers: string[],
  questionType: string
): string => {
  let score = 0;
  let formattedAnswers = "";
  // The nonRegexCorrectAnswers now only contains the actual test answers (no C Major examples)
  let correctAnswers = nonRegexCorrectAnswers.join(", ");

  for (let i = 0; i < regexCorrectAnswers.length; i++) {
    let chord = studentAnswers[i + 3] || "";
    let isCorrect = regexCorrectAnswers[i].test(chord);
    if (isCorrect) {
      score++;
    }
  }

  // Format answers (all answers are actual test answers now, no need to skip)
  for (let i = 0; i < regexCorrectAnswers.length; i++) {
    // We need to offset the student answers by 3 to skip the C Major examples
    let chord = studentAnswers[i + 3] || "";
    let isCorrect = regexCorrectAnswers[i].test(chord);

    if (i % 3 === 0) {
      if (i !== 0) formattedAnswers += "</li>";
      formattedAnswers += "<li>";
    }
    formattedAnswers += isCorrect ? chord : `<b>${chord || "(No answer)"}</b>`;
    if (i % 3 !== 2 && i < regexCorrectAnswers.length - 1)
      formattedAnswers += ", ";
  }

  if (formattedAnswers) {
    formattedAnswers += "</li>";
  }

  const totalQuestions = regexCorrectAnswers.length;

  // Format correct answers as an ordered list
  let correctAnswersFormatted = "";
  const correctAnswersArray = nonRegexCorrectAnswers;
  
  for (let i = 0; i < correctAnswersArray.length; i++) {
    if (i % 3 === 0) {
      if (i !== 0) correctAnswersFormatted += "</li>";
      correctAnswersFormatted += "<li>";
    }
    correctAnswersFormatted += correctAnswersArray[i];
    if (i % 3 !== 2 && i < correctAnswersArray.length - 1)
      correctAnswersFormatted += ", ";
  }
  
  if (correctAnswersFormatted) {
    correctAnswersFormatted += "</li>";
  }

  const result = `<b>${score}/${totalQuestions}</b> on the ${questionType} section.
    <ol>Actual student answers:
      ${formattedAnswers}
    </ol>
    <ol>Correct answers:
      ${correctAnswersFormatted}
    </ol>`;

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

  // Format correct answers as an ordered list
  let correctAnswersFormatted = "";
  for (let i = 0; i < correctAnswers.length; i++) {
    correctAnswersFormatted += `<li>${correctAnswers[i]}</li>`;
  }

  const result = `<b>${score}/${correctAnswers.length}</b> on the ${questionType} section.
    <ol>Actual student answers: ${answersHTML}</ol>
    <ol>Correct answers: ${correctAnswersFormatted}</ol>`;

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

  // Format correct answers as an ordered list
  let correctAnswersFormatted = "";
  for (let i = 0; i < nonRegexCorrectAnswers.length; i++) {
    correctAnswersFormatted += `<li>${nonRegexCorrectAnswers[i]}</li>`;
  }

  const result = `<b>${score}/${regexCorrectAnswers.length}</b> on the ${questionType} section.
    <ol>Actual student answers:${studentAnswersHTML}</ol>
    <ol>Correct answers: ${correctAnswersFormatted}</ol>`;

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

          // Normalize note name for case-insensitive comparison
          // This handles the special B/b case and any other case differences
          const normalizedUserNote = userNote?.toLowerCase() || "";
          const normalizedCorrectNote = correctNote?.toLowerCase() || "";

          if (normalizedUserNote !== normalizedCorrectNote) {
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
  correctAnswersText: string[],
  questionType: string
): string => {
  let score = 0;
  let actualStudentAnswers = "";

  for (let i = 0; i < correctAnswersText.length; i++) {
    if (!userAnswers[i] || userAnswers[i].length === 0) {
      actualStudentAnswers += `<li><b>(No answer provided)</b></li>`;
    } else {
      const userAnswerNotes = userAnswers[i]
        .map((note) => note.split("/")[0].toLowerCase())
        .sort();

      const answerForEmail = userAnswers[i]
        .map((note) => note.split("/")[0])
        .join(", ");
      const correctAnswerNotes = correctAnswersText[i]
        .split(",")
        .map((note) => note.trim().toLowerCase())
        .sort();

      // Compare sorted lists of notes
      const isCorrect =
        userAnswerNotes.length === correctAnswerNotes.length &&
        userAnswerNotes.every(
          (note, index) => note === correctAnswerNotes[index]
        );

      if (isCorrect) {
        score++;
        actualStudentAnswers += `<li>${answerForEmail}</li>`;
      } else {
        actualStudentAnswers += `<li><b>${answerForEmail}</b></li>`;
      }
    }
  }

  const formattedCorrectAnswersList = correctAnswersText
    .map((answer) => `<li>${answer}</li>`)
    .join("");

  const result = `<b>${score}/${correctAnswersText.length}</b> on the ${questionType} section.
    <ol>Actual student answers:${actualStudentAnswers}</ol>
    <ol>Correct answers:${formattedCorrectAnswersList}</ol>`;

  return result;
};
