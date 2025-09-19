import { model, modelID } from "@/ai/providers";
import { weatherTool } from "@/ai/tools";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    selectedModel,
  }: { messages: UIMessage[]; selectedModel: modelID } = await req.json();

  try {
    const result = streamText({
      model: model.languageModel(selectedModel),
      system: "You are a helpful assistant. When users share images, analyze them carefully and provide detailed, helpful responses about what you see.",
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(5), // enable multi-step agentic flow
      tools: {
        getWeather: weatherTool,
      },
      experimental_telemetry: {
        isEnabled: false,
      },
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      onError: (error) => {
        if (error instanceof Error) {
          if (error.message.includes("Rate limit")) {
            return "Rate limit exceeded. Please try again later.";
          }
          if (error.message.includes("vision") || error.message.includes("multimodal")) {
            return "This model doesn't support image analysis. Please select a vision-capable model.";
          }
        }
        console.error(error);
        return "Request in queue due to heavy demand. Please try a different model or try again after some time.";
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: "Request in queue due to heavy demand. Please try a different model or try again after some time." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
