
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

interface QuestionDisplayProps {
  question: string;
  isRecording: boolean;
  isVideoMode: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const QuestionDisplay = ({
  question,
  isRecording,
  isVideoMode,
  videoRef,
  onStartRecording,
  onStopRecording,
}: QuestionDisplayProps) => {
  return (
    <div className="space-y-4">
      <div className="bg-mint-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-mint-800 mb-2">Current Question:</h3>
        <p className="text-gray-700">{question}</p>
      </div>

      {isVideoMode && (
        <div className="relative aspect-video max-w-2xl mx-auto">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full rounded-lg bg-black"
          />
        </div>
      )}

      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={onStartRecording}
            className="bg-mint-500 hover:bg-mint-600 text-white transition-all duration-200"
          >
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={onStopRecording}
            variant="destructive"
            className="transition-all duration-200"
          >
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
