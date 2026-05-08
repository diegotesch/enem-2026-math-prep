import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Qual é o valor de x na equação 2x + 5 = 15?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '5'
  },
  {
    id: 2,
    question: 'Qual é a área de um triângulo com base 10 cm e altura 8 cm?',
    options: ['20 cm²', '40 cm²', '80 cm²', '160 cm²'],
    correctAnswer: '40 cm²'
  },
  {
    id: 3,
    question: 'Qual é o valor de f(2) se f(x) = 3x² - 2x + 1?',
    options: ['5', '7', '9', '11'],
    correctAnswer: '9'
  },
  {
    id: 4,
    question: 'Qual é o perímetro de um quadrado com lado 5 cm?',
    options: ['10 cm', '15 cm', '20 cm', '25 cm'],
    correctAnswer: '20 cm'
  },
  {
    id: 5,
    question: 'Qual é o valor de √144?',
    options: ['10', '11', '12', '13'],
    correctAnswer: '12'
  }
];

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(answer);
    if (answer === QUESTIONS[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      Alert.alert('Quiz finalizado!', `Sua pontuação: ${score}/${QUESTIONS.length}`, [
        { text: 'OK', onPress: () => {
          // Reset quiz
          setCurrentQuestionIndex(0);
          setScore(0);
          setSelectedAnswer(null);
          setShowResult(false);
        }}
      ]);
    }
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  // Determine feedback text and color
  let feedbackText = '';
  let feedbackColor = '#333';
  
  if (showResult && !selectedAnswer) {
    feedbackText = `Tempo esgotado! A resposta correta era: ${currentQuestion.correctAnswer}`;
    feedbackColor = '#721c24';
  } else if (selectedAnswer) {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      feedbackText = 'Correto!';
      feedbackColor = '#155724';
    } else {
      feedbackText = `Incorreto! A resposta correta era: ${currentQuestion.correctAnswer}`;
      feedbackColor = '#721c24';
    }
  }

  // Determine button title and disabled state
  const buttonTitle = selectedAnswer ? 'Próxima pergunta' : 'Responder';
  const buttonDisabled = !selectedAnswer && !showResult;

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Pergunta {currentQuestion.id}: {currentQuestion.question}</Text>
      <FlatList
        data={currentQuestion.options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              selectedAnswer !== null && item === currentQuestion.correctAnswer && styles.correct,
              selectedAnswer !== null && item === selectedAnswer && styles.incorrect,
              !selectedAnswer && showResult && item === currentQuestion.correctAnswer && styles.correct,
            ].filter(Boolean)}
            onPress={() => handleAnswer(item)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      {feedbackText && <Text style={[styles.feedback, { color: feedbackColor }]}>{feedbackText}</Text>}
      <Button
        title={buttonTitle}
        onPress={handleNext}
        disabled={buttonDisabled}
        color="#841584"
      />
      <Text style={styles.score}>Pontuação: {score}/{currentQuestionIndex + (selectedAnswer ? 1 : 0)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  option: {
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  correct: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  incorrect: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  feedback: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  score: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
});