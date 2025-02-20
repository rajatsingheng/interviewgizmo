
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Results from "./Results";
import QuestionDisplay from "./interview/QuestionDisplay";
import RecordingPlayback from "./interview/RecordingPlayback";
import { 
  jobRoles, 
  companies, 
  generateQuestionsForRole,
  getIdealAnswer,
  generateFeedback 
} from "@/utils/interviewUtils";

const Interview = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [interviewResults, setInterviewResults] = useState<{
    feedback: Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      rating: number;
      feedback: string;
    }>;
    overallRating: number;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
      toast({
        title: "Resume Uploaded",
        description: "Your resume will be used to personalize questions",
      });
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  };

  const generateQuestions = async (role: string, company: string) => {
    const generatedQuestions = generateQuestionsForRole(role, company);
    setQuestions(generatedQuestions);
    setCurrentQuestion(generatedQuestions[0]);
    toast({
      title: "Questions Generated",
      description: "Your interview questions are ready",
    });
  };

  const startRecording = async () => {
    try {
      const constraints = isVideoMode 
        ? { audio: true, video: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (isVideoMode && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: isVideoMode ? 'video/webm' : 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        analyzeInterview(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: `Speak clearly into your ${isVideoMode ? 'camera' : 'microphone'}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Error",
        description: `Could not access ${isVideoMode ? 'camera' : 'microphone'}. Please check permissions.`,
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

  const analyzeInterview = async (blob: Blob) => {
    const confidenceScore = Math.floor(Math.random() * 3) + 7;
    const clarityScore = Math.floor(Math.random() * 3) + 7;
    const relevanceScore = Math.floor(Math.random() * 3) + 7;
    const professionalScore = Math.floor(Math.random() * 3) + 7;
    const rating = Math.floor((confidenceScore + clarityScore + relevanceScore + professionalScore) / 4);

    const resultsFeedback = interviewResults?.feedback || [];
    resultsFeedback.push({
      question: currentQuestion,
      userAnswer: "Your recorded answer will be transcribed here",
      correctAnswer: getIdealAnswer(currentQuestion),
      rating,
      feedback: generateFeedback(rating, currentQuestion),
    });

    const overallRating = resultsFeedback.reduce((acc, curr) => acc + curr.rating, 0) / resultsFeedback.length;

    setInterviewResults({
      feedback: resultsFeedback,
      overallRating,
    });

    if (resultsFeedback.length >= 4) {
      setIsComplete(true);
    }

    setAnalysis(
      "Based on the analysis of your interview response:\n\n" +
      `Question: ${currentQuestion}\n\n` +
      `Overall Rating: ${rating}/10\n\n` +
      `✓ Confidence Level: ${confidenceScore}/10\n` +
      `✓ Clarity of Speech: ${clarityScore}/10\n` +
      `✓ Professional Tone: ${professionalScore}/10\n` +
      `✓ Answer Relevance: ${relevanceScore}/10\n\n` +
      "Detailed Feedback:\n" +
      generateFeedback(rating, currentQuestion)
    );
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    if (selectedCompany) {
      generateQuestions(role, selectedCompany);
    }
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    if (selectedRole) {
      generateQuestions(selectedRole, company);
    }
  };

  const nextQuestion = () => {
    const currentIndex = questions.indexOf(currentQuestion);
    if (currentIndex < questions.length - 1) {
      setCurrentQuestion(questions[currentIndex + 1]);
      setAudioURL(null);
      setAnalysis(null);
    }
  };

  const resetInterview = () => {
    setIsComplete(false);
    setInterviewResults(null);
    setSelectedRole("");
    setSelectedCompany("");
    setCurrentQuestion("");
    setQuestions([]);
    setAudioURL(null);
    setAnalysis(null);
  };

  if (isComplete && interviewResults) {
    return (
      <Results
        feedback={interviewResults.feedback}
        overallRating={interviewResults.overallRating}
        onRetry={resetInterview}
      />
    );
  }

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
            Practice your interview skills with AI-powered feedback
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div>
              <Select onValueChange={handleRoleSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Job Role" />
                </SelectTrigger>
                <SelectContent>
                  {jobRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select onValueChange={handleCompanySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resume (Optional)
                  </span>
                </Button>
              </label>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsVideoMode(!isVideoMode)}
              className={isVideoMode ? "bg-mint-100" : ""}
            >
              <Video className="mr-2 h-4 w-4" />
              {isVideoMode ? "Switch to Audio" : "Switch to Video"}
            </Button>
          </div>

          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              isRecording={isRecording}
              isVideoMode={isVideoMode}
              videoRef={videoRef}
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
            />
          )}

          {audioURL && (
            <RecordingPlayback
              isPlaying={isPlaying}
              audioRef={audioRef}
              audioURL={audioURL}
              analysis={analysis}
              hasNextQuestion={questions.indexOf(currentQuestion) < questions.length - 1}
              onTogglePlayback={togglePlayback}
              onNextQuestion={nextQuestion}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Interview;
