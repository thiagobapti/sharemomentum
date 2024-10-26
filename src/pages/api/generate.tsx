import OpenAIApi from "openai";
import { programs } from "@/app/data/database";

export default async function handler(req: any, res: any) {
  const { programId } = req.query;

  const program = programs.find(
    (entry: any) => entry.id.toString() === programId.toString()
  );

  if (!program) {
    res.status(404).send(`Program not found, ${JSON.stringify(program)}`);
    return;
  }

  const context = program.context;
  const keywords = program.keywords;
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
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
          content: `Considering the context: ${context} and the keyword: ${keyword}, create a title of 5 to 10 words and a subtitle from 10 to 20 words separating them in different json nodes named title and subtitle. The general idea is to be creative and to create campaigns inviting donors to donate to the cause.`,
        },
      ],
      max_tokens: 50,
    })) as any; // Add this type assertion

    const twoLiner = JSON.parse(response.choices[0].message.content.trim());

    const unsplashResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${keyword}&client_id=HqMm_ZIV-bj1vY-_Z7s1Vnb8hoaAwq5TYuiq_aaxCQk`
    );

    const unsplashData = await unsplashResponse.json();

    const result = {
      llm: twoLiner,
      backgroundImageUrl: unsplashData.results[0].urls.full,
    };

    res.setHeader("Content-Type", "text/json");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating two-liner");
  }
}
