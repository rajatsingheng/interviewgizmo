
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface QuestionFeedback {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  rating: number;
  feedback: string;
}

interface ResultsProps {
  feedback: QuestionFeedback[];
  overallRating: number;
  onRetry: () => void;
}

const Results = ({ feedback, overallRating, onRetry }: ResultsProps) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-6 space-y-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl">
        <div className="text-center space-y-4">
          <div className="inline-block px-4 py-2 bg-green-100 rounded-full">
            <h1 className="text-2xl font-bold text-green-800">
              Congratulations! Interview Complete
            </h1>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Star className="h-8 w-8 text-yellow-400 fill-current" />
            <span className="text-3xl font-bold">
              Overall Rating: {overallRating.toFixed(1)}/10
            </span>
          </div>
          
          <p className="text-gray-600">
            Find below your detailed feedback for each question
          </p>
        </div>

        <div className="space-y-8 mt-8">
          {feedback.map((item, index) => (
            <div key={index} className="border rounded-lg p-6 space-y-4 bg-gray-50">
              <h3 className="text-xl font-semibold text-gray-900">
                Question {index + 1}: {item.question}
              </h3>
              
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-medium">Rating: {item.rating}/10</span>
              </div>

              <div className="space-y-2">
                <div>
                  <h4 className="font-medium text-gray-700">Your Answer:</h4>
                  <p className="text-gray-600 bg-white p-3 rounded border">
                    {item.userAnswer}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Ideal Answer:</h4>
                  <p className="text-gray-600 bg-white p-3 rounded border">
                    {item.correctAnswer}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700">Feedback for Improvement:</h4>
                  <p className="text-gray-600 bg-white p-3 rounded border">
                    {item.feedback}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={onRetry}
            className="bg-mint-500 hover:bg-mint-600 text-white transition-all duration-200"
          >
            Try Another Interview
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Results;
