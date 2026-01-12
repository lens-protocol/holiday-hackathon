"use server";
import axios from "axios";

// Function to calculate accuracy based on exact word matches
export const calculateAccuracy = (
  correctPrompt: string,
  userPrompt: string
): number => {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]/g, " ")
      .trim();

  const correctWords = normalize(correctPrompt).split(" ");
  const userWords = normalize(userPrompt).split(" ");

  const totalWords = correctWords.length;
  const matchedWords = correctWords.filter((word) => userWords.includes(word));

  return Math.round((matchedWords.length / totalWords) * 100);
};

const cosineSimilarity = function (a: any, b: any) {
  const dotProduct = a.reduce(
    (sum: number, value: number, index: number) => sum + value * b[index],
    0
  );
  const magnitudeA = Math.sqrt(
    a.reduce((sum: number, value: number) => sum + value * value, 0)
  );
  const magnitudeB = Math.sqrt(
    b.reduce((sum: number, value: number) => sum + value * value, 0)
  );
  return dotProduct / (magnitudeA * magnitudeB);
};

// Function to calculate accuracy based on semantic similarity using OpenAI API
export const calculateSemanticAccuracy = async (
  correctPrompt: string,
  userPrompt: string
): Promise<number> => {
  const apiUrl = "https://api.openai.com/v1/embeddings";

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "text-embedding-ada-002", // Model for generating embeddings
        input: [
          correctPrompt, // First text to embed
          userPrompt, // Second text to embed
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        },
      }
    );
    console.log("DATA: ", response.data.data);
    const [correctPromptEmbedding, userPromptEmbedding] = response.data.data;
    const correctPromptVector = correctPromptEmbedding.embedding;
    const userPromptVector = userPromptEmbedding.embedding;

    const similarityScore = cosineSimilarity(
      correctPromptVector,
      userPromptVector
    );
    return Math.round(similarityScore * 100); // Convert to percentage
  } catch (error) {
    console.error("Error in semantic scoring:", error);
    return 0; // Fallback score in case of error
  }
};
