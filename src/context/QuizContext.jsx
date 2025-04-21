import { useContext, useEffect, useReducer } from "react";
import { createContext } from "react";

const QuizContext = createContext();

const SEC_PER_QUESTION = 30;
    
const initialState = {
  questions: [],
  // loading,error,ready,active,finished
  status: "loading",
  //current question
  index: 0,
  //my answer
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: action.status };
    case "dataFailed":
      return { ...state, status: "error" };
    case "quizStart":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PER_QUESTION,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finished": {
      return {
        ...state,
        status: "finished",
        highscore: state.points > state.highscore ? state.points : state.highscore,
      };
    }
    case "newAnswer": {
      const currentQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points,
      };
    }
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    // return { ...state, status: "ready", index: 0, answer: null, points: 0 };
    case "tich":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("unknown action");
  }
}






function QuizProvider({ children }) {
    const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] =
        useReducer(reducer, initialState);
    
      const maxPoints = questions.reduce((acc, question) => acc + question.points, 0);

      useEffect(() => {
        async function getQuestions() {
          try {
            let response = await fetch("http://localhost:8000/questions");
            //check response
            if (!response.ok) {
              throw new Error("data fetch failed");
            }
            let data = await response.json();
            dispatch({ type: "dataRecieved", payload: data, status: "ready" });
          } catch (error) {
            dispatch({ type: "dataFailed" });
          }
        }
        getQuestions();
      }, []);

    return (
        <QuizContext.Provider value={{questions, status, index, answer, points, highscore, secondsRemaining, maxPoints, dispatch}}>
            {children}
        </QuizContext.Provider>
    );
}

function useQuiz() {
    const context = useContext(QuizContext);
    if (context === undefined) {
        throw new Error("useQuiz must be used within a QuizProvider");
    }
    return context;
}
export { QuizProvider, useQuiz };