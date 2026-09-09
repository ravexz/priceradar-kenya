import { NextResponse } from 'next/server';
import { AIShoppingAssistantService } from '@/lib/services/ai-assistant.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: { message: 'Prompt string is required' } }, { status: 400 });
    }

    const result = await AIShoppingAssistantService.queryAssistant(prompt);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API AI Assistant Error:', error);
    return NextResponse.json(
      { error: { code: 'AI_ERROR', message: error.message || 'Assistant failed to process prompt' } },
      { status: 500 }
    );
  }
}
