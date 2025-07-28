import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

export class GenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required for GenAIService");
    }
    this.apiKey = apiKey;
  }

  private async getGenerativeModel(options: {
    model: string;
  }): Promise<GenerativeModel> {
    const genAI = new GoogleGenerativeAI(this.apiKey);
    return genAI.getGenerativeModel(options);
  }

  public async generateResponse(prompt: string): Promise<Array<string>> {
    const model = await this.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(
      this.generatePromptContext(prompt)
    );
    const responseText = result.response.text();
    return this.splitMessage(responseText);
  }

  private generatePromptContext(prompt: string): string {
    return `
        You are a helpful assistant that provides concise, accurate, and relevant responses. 
        Always answer clearly and to the point unless asked otherwise.

        Respond based on the user's intent using the following guidelines:

        ### General Principles
        - Be concise and clear in all responses.
        - Be accurate and factual.
        - If unsure, politely say so rather than guessing.

        ### Response Types
        - **Summary**: Provide a brief and accurate overview.
        - **Detailed Explanation**: Offer a thorough and well-structured explanation.
        - **List**: Return an organized, well-structured bullet-point or numbered list.
        - **Definition**: Give a clear and concise definition.
        - **Code Example**: Provide a relevant and functional code snippet with brief explanation.
        - **Translation**: Offer an accurate and fluent translation.
        - **Recommendation**: Give a thoughtful and helpful suggestion or alternative.
        - **Comparison**: Provide a balanced and fair comparison between items.
        - **Solution**: Present a practical, effective solution with rationale if needed.
        - **Step-by-Step Guide**: Break down instructions logically and clearly.
        - **Creative Response**: Respond with imagination, engagement, and relevance to the user's context.
        - **Question**: Pose a thoughtful and relevant question based on the context.
        - **Fact**: Deliver a verified and accurate fact.
        - **Opinion**: Share a respectful and well-reasoned viewpoint.
        - **Joke**: Keep it light-hearted, appropriate, and relevant.
        - **Story**: Tell an engaging and concise story when appropriate.
        - **Advice**: Provide actionable and practical advice.
        - **Quote**: Provide an inspiring and relevant quote.

        If the user provides a specific context or data, always refer to it and tailor your response accordingly.

        ### Response Format
        - Always use clear and simple language.
        - Use proper grammar and punctuation.
        - For lists, use bullet points or numbers for clarity.
        - For code examples, ensure they are well-commented and easy to understand.
        - For translations, maintain the original meaning and context.
        - For comparisons, highlight key differences and similarities.
        - For recommendations, provide reasoning behind the choice.
        - For solutions, explain the reasoning and steps taken.
        - For step-by-step guides, number the steps clearly.
        - For creative responses, ensure they are engaging and relevant to the user's context.
        - For jokes, ensure they are appropriate and relevant.
        - For stories, keep them concise and engaging.
        - For advice, ensure it is practical and actionable.
        - For quotes, ensure they are relevant and inspiring.

        When the user asks a question, response with the above information in mind, ensuring that the response is tailored to the user's needs and context.
        User: ${prompt}
        Bot:
    `;
  }

  private splitMessage(text: string, maxLength: number = 1900): Array<string> {
    if (text.length <= maxLength) return [text];

    const chunks: Array<string> = [];
    let start = 0;

    while (start < text.length) {
      let end = Math.min(start + maxLength, text.length);
      let breakPoint = Math.max(
        text.lastIndexOf(".", end),
        text.lastIndexOf("?", end),
        text.lastIndexOf("!", end),
        text.lastIndexOf("\n", end),
        text.lastIndexOf(" ", end)
      );

      // If the break point is before the start or not found, then just assume as the end of the chunk
      if (breakPoint > start) end = breakPoint + 1;

      chunks.push(text.slice(start, end).trim());
      start = end;
      while (start < text.length && text[start] === " ") start++;
    }

    return chunks.filter((chunk) => chunk.length > 0);
  }
}
