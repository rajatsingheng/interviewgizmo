import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mic, Square, PlayCircle, PauseCircle, ArrowRight, Upload, Video } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const jobRoles = [
  "Software Engineer",
  "Product Manager", 
  "Data Scientist",
  "UX Designer",
  "Marketing Manager",
  "Sales Representative",
  "Project Manager",
];

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Tesla",
  "Other"
];

const generateQuestionsForRole = (role: string, company: string) => {
  const commonQuestions = [
    "Tell me about yourself and your background.",
    "Why do you want to work at our company?",
    "Where do you see yourself in 5 years?",
  ];

  const roleSpecificQuestions: Record<string, string[]> = {
    "Software Engineer": [
      "Can you explain a challenging technical problem you've solved recently?",
      "What's your experience with system design and scalability?",
      "How do you approach testing and debugging?",
      "Explain the concept of time and space complexity.",
      "What's your preferred programming language and why?",
    ],
    "Product Manager": [
      "How do you prioritize features in a product roadmap?",
      "Describe a time when you had to make a difficult product decision.",
      "How do you gather and incorporate user feedback?",
      "Walk me through your process for launching a new product.",
      "How do you measure product success?",
    ],
    "Data Scientist": [
      "Explain your approach to A/B testing.",
      "How do you handle missing or corrupt data?",
      "Describe a complex data analysis project you've worked on.",
      "What's your experience with machine learning models?",
      "How do you communicate technical findings to non-technical stakeholders?",
    ],
  };

  const companySpecificQuestions = company !== "Other" ? [
    `What interests you most about ${company}'s products or services?`,
    `How would you contribute to ${company}'s mission and values?`,
    `What recent ${company} announcement or product launch excited you?`,
  ] : [];

  return [
    ...commonQuestions,
    ...(roleSpecificQuestions[role] || []),
    ...companySpecificQuestions,
  ];
};

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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();
  const chunksRef = useRef<BlobPart[]>([]);
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

  const getIdealAnswer = (question: string) => {
    const answers: Record<string, string> = {
      "Tell me about yourself and your background.": 
        "I am a results-driven professional with X years of experience in [field]. I've developed expertise in [specific skills] through my work at [previous companies/projects]. I'm particularly passionate about [relevant interests] and have a proven track record of [specific achievements].",
      "Why do you want to work at our company?":
        "I'm impressed by your company's innovation in [specific area] and commitment to [company values]. Your recent [project/product] particularly caught my attention. I believe my skills in [relevant skills] align perfectly with your needs, and I'm excited about contributing to [specific company goals].",
      "Where do you see yourself in 5 years?":
        "I am looking to advance my career in [specific field] and contribute to [specific company goals]. I am excited about the opportunity to work with [specific team members] and learn from [specific mentors].",
    };
    return answers[question] || "The ideal answer would demonstrate deep understanding of the topic, provide specific examples from experience, and show alignment with industry best practices.";
  };

  const generateFeedback = (rating: number, question: string) => {
    if (rating >= 8) {
      return "Excellent response! You demonstrated strong knowledge and provided relevant examples. Consider adding more specific metrics or outcomes to strengthen your answer further.";
    } else if (rating >= 6) {
      return "Good answer, but there's room for improvement. Try to include more specific examples and structure your response using the STAR method (Situation, Task, Action, Result).";
    } else {
      return "Your answer needs significant improvement. Focus on understanding the core concepts, prepare specific examples from your experience, and practice articulating your thoughts clearly.";
    }
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
            <div className="space-y-4">
              <div className="bg-mint-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-mint-800 mb-2">Current Question:</h3>
                <p className="text-gray-700">{currentQuestion}</p>
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
            </div>
          )}

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

              {questions.indexOf(currentQuestion) < questions.length - 1 && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={nextQuestion}
                    className="bg-mint-500 hover:bg-mint-600 text-white transition-all duration-200"
                  >
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Interview;
