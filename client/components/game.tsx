"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/consts/prompts";
import { calculateSemanticAccuracy } from "@/utils/scoring";
import { SelectValue } from "@radix-ui/react-select";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function GamePage() {
  const [step, setStep] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [resultPercent, setResultPercent] = useState<number>(0);
  const [selectedPrompt, setSelectedPrompt] = useState<{
    prompt: string;
    image: string;
  }>({ prompt: "", image: "" });
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const getFeedbackMessage = (percentage: number): string => {
    if (percentage === 0) {
      return "No comprendo. Try again.";
    } else if (percentage === 50) {
      return "Almost there never surrender.";
    } else if (percentage === 100) {
      return "Look at you word nerd.";
    } else {
      return "";
    }
  };

  const submitAnswer = async () => {
    const percentage = await calculateSemanticAccuracy(
      selectedPrompt.prompt,
      userPrompt
    );
    setResultPercent(percentage);
    setFeedbackMessage(getFeedbackMessage(percentage));
    setUserPrompt("");
    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (selectedCategory) {
      const randomPrompt =
        CATEGORIES[selectedCategory][
          Math.floor(Math.random() * CATEGORIES[selectedCategory].length)
        ];
      setSelectedPrompt(randomPrompt);
    }
  }, [selectedCategory]);

  return (
    <>
      {
        {
          0: (
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle className="bolder">Game category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  onValueChange={(value: string) => setSelectedCategory(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose Game Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORIES).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.replace(/([A-Z])/g, " $1").trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="mt-4 w-full"
                  onClick={() => setStep(1)}
                  variant="default"
                >
                  Play
                </Button>
              </CardContent>
            </Card>
          ),
          1: (
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>
                  Category: {selectedCategory.replace(/([A-Z])/g, " $1").trim()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  className="rounded-lg"
                  width={500}
                  height={500}
                  alt="category image"
                  src={selectedPrompt.image}
                />
                <div className="my-4 flex flex-col gap-1">
                  <Label htmlFor="message">Your prompt guess</Label>

                  <Textarea
                    id="prompt"
                    placeholder="Type prompt guess..."
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                  />
                </div>
                <Button
                  disabled={!userPrompt}
                  className="w-full"
                  variant="default"
                  onClick={submitAnswer}
                >
                  Submit
                </Button>
              </CardContent>
            </Card>
          ),
          2: (
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle className="text-center text-5xl">
                  Your Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-center text-6xl">{resultPercent}%</h1>
                <p className="mt-4 text-center">{feedbackMessage}</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    window.location.reload();
                  }}
                  variant="default"
                  className="w-full"
                >
                  Play Again
                </Button>
              </CardFooter>
            </Card>
          ),
        }[step]
      }
    </>
  );
}
