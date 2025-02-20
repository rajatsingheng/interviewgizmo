
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mic, Square, PlayCircle, PauseCircle } from "lucide-react";

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        analyzeInterview(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      toast({
        title: "Recording completed",
        description: "Analyzing your interview...",
      });
    }
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const analyzeInterview = async (audioBlob: Blob) => {
    // Placeholder for AI analysis
    // In a real implementation, you would send the audio to an AI service
    setAnalysis("Based on the analysis of your interview:\n\n" +
      "✓ Confidence Level: 7/10\n" +
      "✓ Clarity of Speech: 8/10\n" +
      "✓ Professional Tone: 8/10\n\n" +
      "Suggestions for improvement:\n" +
      "1. Try to reduce filler words like 'um' and 'uh'\n" +
      "2. Speak slightly slower when explaining technical concepts\n" +
      "3. Include more specific examples in your responses");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fadeIn">
      <Card className="p-6 space-y-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-xl">
        <div className="text-center space-y-2">
          <span className="px-3 py-1 text-xs font-medium bg-mint-100 text-mint-800 rounded-full">
            Interview Session
          </span>
          <h1 className="text-3xl font-semibold text-gray-900">
            AI Mock Interview Coach
          </h1>
          <p className="text-gray-600">
            Record your interview responses for AI-powered analysis and feedback
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="bg-mint-500 hover:bg-mint-600 text-white transition-all duration-200"
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              variant="destructive"
              className="transition-all duration-200"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </Button>
          )}
        </div>

        {audioURL && (
          <div className="space-y-4">
            <div className="flex justify-center items-center space-x-4">
              <Button
                onClick={togglePlayback}
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
                onEnded={() => setIsPlaying(false)}
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
          </div>
        )}
      </Card>
    </div>
  );
};

export default Interview;
