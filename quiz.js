const quizData = [
    {
      question: "What is the capital of Austria?",
      options: ["Paris", "Madrid", "Rome", "Vienna"],
      answer: "Vienna"
    },
    {
      question: "What is the currency of Mexico?",
      options: ["Dollar", "Peso", "Euro", "Rupee"],
      answer: "Peso"
    },
    {
      question: "What is the world's tallest building?",
      options: ["Tower of Pisa", "CNN Tower", "Empire State", "Burj Khalifa"],
      answer: "Burj Khalifa"
    },
    {
      question: "Where is zero island located?",
      options: ["Mediterranean Sea", "Gulf of Guinea", "Pacific Ocean", "Caribbean Sea"],
      answer: "Gulf of Guinea"
    },
    {
      question: "What's a point of inaccesibility?",
      options: ["Somewhere impossible to reach", "A cursed point", "Somewhere that's the farthest from the ocean", "A joke, there's no such thing"],
      answer: "Somewhere that's the farthest from the ocean"
    },
    {
      question: "Which of the following is a European microstate?",
      options: ["Mongolia", "New Zealand", "San Marino", "Panama"],
      answer: "San Marino"
    },
    {
      question: "What's the North Pole?",
      options: ["The place were Santa lives", "The northernmost place on Earth", "A polar bear sanctuary", "A building"],
      answer: "The northernmost place on Earth"
    },
  ];
  
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");
  const submitButton = document.getElementById("submit");
  
  let currentQuestion = 0;
  let score = 0;
  
  function showQuestion() {
    const question = quizData[currentQuestion];
    questionElement.innerText = question.question;
  
    optionsElement.innerHTML = "";
    question.options.forEach(option => {
      const button = document.createElement("button");
      button.innerText = option;
      optionsElement.appendChild(button);
      button.addEventListener("click", selectAnswer);
    });
  }
  
  function selectAnswer(e) {
    const selectedButton = e.target;
    const answer = quizData[currentQuestion].answer;
  
    if (selectedButton.innerText === answer) {
      score++;
    }
  
    currentQuestion++;
  
    if (currentQuestion < quizData.length) {
      showQuestion();
    } else {
      showResult();
    }
  }
  
  function showResult() {
    quiz.innerHTML = `
      <h1 style="color:white; font-family:'sans-serif'">Quiz Completed!</h1>
      <p style="color:white;">Your score: ${score}/${quizData.length}</p>
    `;
  }
  
  showQuestion();
