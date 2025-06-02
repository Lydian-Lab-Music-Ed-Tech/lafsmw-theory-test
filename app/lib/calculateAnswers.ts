export const checkAndFormat251Answers = (
  studentAnswers: string[],
  regexCorrectAnswers: RegExp[],
  nonRegexCorrectAnswers: string[],
  questionType: string
): string => {
  let score = 0;
  let formattedAnswers = "";
  let correctAnswers = nonRegexCorrectAnswers.join(", ");

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
    <ul>Correct answers: ${correctAnswers}</ul>`;

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

          // Normalize note name for case-insensitive comparison
          // This handles the special B/b case and any other case differences
          const normalizedUserNote = userNote.toLowerCase();
          const normalizedCorrectNote = correctNote.toLowerCase();

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
  correctAnswers: RegExp[], // Note: This parameter is no longer used for the core chord checking logic
  correctAnswersText: string[],
  questionType: string
): string => {
  let score = 0;
  let actualStudentAnswers = "";

  // Iterate based on the number of correct answers defined in correctAnswersText
  for (let i = 0; i < correctAnswersText.length; i++) {
    if (!userAnswers[i] || userAnswers[i].length === 0) {
      actualStudentAnswers += `<li><b>(No answer provided)</b></li>`;
    } else {
      // Process user's answer: extract note letters, convert to lowercase, sort
      const userAnswerNotes = userAnswers[i]
        .map((note) => note.split("/")[0].toLowerCase()) // Get note letter, make lowercase
        .sort(); // Sort alphabetically

      // Format user's answer for display (e.g., in email), preserving original input order/case
      const answerForEmail = userAnswers[i]
        .map((note) => note.split("/")[0])
        .join(", ");

      // Process correct answer: split comma-separated string, trim, convert to lowercase, sort
      const correctAnswerNotes = correctAnswersText[i]
        .split(",")
        .map((note) => note.trim().toLowerCase()) // Split by comma, trim, make lowercase
        .sort(); // Sort alphabetically

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

  // Format the list of correct answers for display
  const formattedCorrectAnswersList = correctAnswersText
    .map((answer) => `<li>${answer}</li>`)
    .join("");

  const result = `<b>${score}/${correctAnswersText.length}</b> on the ${questionType} section.
    <ol>Actual student answers:${actualStudentAnswers}</ol>
    <ol>Correct answers:${formattedCorrectAnswersList}</ol>`;

  return result;
};
