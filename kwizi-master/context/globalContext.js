import React, { useEffect } from "react";
import useCategories from "./useCategories";
import { useWeb3 } from "./Web3Context";
import axios from "axios";

const GlobalContext = React.createContext();

export const GlobalContextProvider = ({ children }) => {
  const { loading, categories } = useCategories();
  const { account, isConnected } = useWeb3();

  const [quizSetup, setQuizSetup] = React.useState({
    questionCount: 1,
    category: null,
    difficulty: null,
  });
  const [selectedQuiz, setSelectedQuiz] = React.useState(null);
  const [quizResponses, setQuizResponses] = React.useState([]);
  const [filteredQuestions, setFilteredQuestions] = React.useState([]);

  useEffect(() => {
    if (!isConnected || !account) return;

    const registerUser = async () => {
      try {
        await axios.post("/api/user/register", {
          walletAddress: account,
        });

        console.log("User registered successfully!");
      } catch (error) {
        console.error("Error registering user:", error);
      }
    };

    if (account) {
      registerUser();
    }
  }, [account, isConnected]);

  console.log("Filtered Questions:", filteredQuestions);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        categories,
        quizSetup,
        setQuizSetup,
        selectedQuiz,
        setSelectedQuiz,
        quizResponses,
        setQuizResponses,
        filteredQuestions,
        setFilteredQuestions,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(GlobalContext);
};
