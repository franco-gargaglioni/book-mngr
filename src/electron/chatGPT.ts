import {BrowserWindow } from "electron";
import OpenAI from "openai";

import { ChatCompletionMessageParam} from "openai/resources/index";

export async function createSummary(mainWindow: BrowserWindow, data: string): Promise<string>{
    const prompt  = data;
    const OPENAI_API_KEY = "Replace here with secret key";
    const openai = new OpenAI({apiKey:OPENAI_API_KEY});
    const aiModel = "gpt-4o-mini";

    const messages : ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: "you are a helpfuld and passionate library assistant"
        },
        {
            role: "user",
            content: prompt
        }
    ];

    const completion = await openai.chat.completions.create({
        model: aiModel,
        messages: messages
    })

    var aiResponse: string | null = completion.choices[0].message.content;

    if (!aiResponse) {
        mainWindow.webContents.send('createSummary', "No summary available");
        return "No summary available";
    }

    mainWindow.webContents.send('createSummary', aiResponse);

    return aiResponse;
}