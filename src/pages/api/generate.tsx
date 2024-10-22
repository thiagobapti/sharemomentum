import OpenAIApi from "openai";
import { programs } from "@/app/data/database";

export default async function handler(req: any, res: any) {
  const { programId } = req.query;

  // Ensure programId is a string for comparison
  const program = programs.find(
    (entry: any) => entry.id.toString() === programId.toString()
  );

  if (!program) {
    res.status(404).send(`Program not found, ${JSON.stringify(program)}`);
    return;
  }

  const context = program.context;

  const openai = new OpenAIApi({
    apiKey:
      "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",
  });

  try {
    const response = (await openai.chat.completions.create({
      response_format: { type: "json_object" },
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a concise and creative phrase generator.",
        },
        {
          role: "user",
          content: `Create a phrase of 5 to 10 words based on this context: ${context} and another from 10 to 20 words separating them in different json nodes named phrase1 and phrase2`,
        },
      ],
      max_tokens: 50,
    })) as any; // Add this type assertion

    const twoLiner = response.choices[0].message.content.trim();

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(`${twoLiner}`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating two-liner");
  }
}
