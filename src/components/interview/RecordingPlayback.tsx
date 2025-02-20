
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, ArrowRight } from "lucide-react";

interface RecordingPlaybackProps {
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  audioURL: string;
  analysis: string | null;
  hasNextQuestion: boolean;
  onTogglePlayback: () => void;
  onNextQuestion: () => void;
}

const RecordingPlayback = ({
  isPlaying,
  audioRef,
  audioURL,
  analysis,
  hasNextQuestion,
  onTogglePlayback,
  onNextQuestion,
}: RecordingPlaybackProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center items-center space-x-4">
        <Button
          onClick={onTogglePlayback}
          variant="outline"
          className="transition-all duration-200"
        >
          {isPlaying ? (
            <PauseCircle className="mr-2 h-4 w-4" />
          ) : (
            <PlayCircle className="mr-2 h-4 w-4" />
          )}
          {isPlaying ? "Pause" : "Play"} Recording
        </Button>
        <audio
          ref={audioRef}
          src={audioURL}
          onEnded={() => onTogglePlayback()}
          className="hidden"
        />
      </div>

      {analysis && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg animate-slideUp">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Analysis & Feedback
          </h2>
          <div className="whitespace-pre-line text-gray-700">
            {analysis}
          </div>
        </div>
      )}

      {hasNextQuestion && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={onNextQuestion}
            className="bg-mint-500 hover:bg-mint-600 text-white transition-all duration-200"
          >
            Next Question
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecordingPlayback;
