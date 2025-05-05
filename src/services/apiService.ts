import { ExecutablePrompt, PromptResult } from '../model/Model';

// URL нашего серверного API
const API_URL = 'http://localhost:3001';

export class ApiService {
  /**
   * Выполняет запрос к OpenAI через наш сервер
   */
  static async executePrompt(prompt: ExecutablePrompt): Promise<PromptResult> {
    try {
      if (prompt.stream === true) {
        // Обработка потокового ответа
        return this.executeStreamingPrompt(prompt);
      }
      
      // Определяем сообщения для отправки
      const messages = prompt.messages || [{ role: 'user', content: prompt.prompt }];
      
      // Обычный запрос без стриминга
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: prompt.model || 'gpt-4o',
          messages: messages,
          temperature: 0,
          json_response: prompt.json,
          response_format_name: prompt.response_format?.name,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const apiResponse = data.response;
      const content = apiResponse.choices[0]?.message?.content || '';

      // Обработка структурированного ответа с помощью Zod (если требуется)
      if (prompt.response_format?.zodObject) {
        try {
          const parsed = JSON.parse(content);
          const validated = prompt.response_format.zodObject.parse(parsed);
          return { result: content, parsed: validated };
        } catch (error) {
          console.error('Error parsing structured response:', error);
          return { result: content };
        }
      }

      return { result: content };
    } catch (error) {
      console.error('Error executing prompt:', error);
      throw error;
    }
  }

  /**
   * Обрабатывает потоковый ответ от API
   */
  private static async executeStreamingPrompt(prompt: ExecutablePrompt): Promise<PromptResult> {
    // Определяем сообщения для отправки
    const messages = prompt.messages || [{ role: 'user', content: prompt.prompt }];
    
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: prompt.model || 'gpt-4o',
        messages: messages,
        temperature: 0,
        json_response: prompt.json,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Streaming API request failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Stream reader not available');
    }

    let completeResult = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');
      
      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const jsonData = JSON.parse(line.slice(5));
            completeResult += jsonData.chunk || '';
          } catch (e) {
            // Пропускаем некорректные данные
          }
        }
      }
    }

    return { result: completeResult };
  }
} 