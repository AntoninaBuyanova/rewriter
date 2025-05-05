import express from 'express';
import { OpenAI } from 'openai';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Настройка CORS для взаимодействия с клиентом
app.use(cors());
app.use(bodyParser.json());

// Получение ключа API из переменных окружения
const apiKey = process.env.OPENAI_API_KEY;

// Инициализация OpenAI с нашим ключом API
const openai = new OpenAI({
  apiKey: apiKey
});

// Эндпоинт для запросов к модели chat completion
app.post('/api/chat', async (req, res) => {
  try {
    // Проверка наличия действительного ключа API
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API ключ не настроен. Установите переменную окружения OPENAI_API_KEY.' 
      });
    }

    const { model, messages, temperature, json_response, response_format_name, stream } = req.body;
    
    // Проверяем, что сообщения есть и это массив
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Сообщения должны быть массивом' });
    }

    if (stream) {
      // Настройка для потокового ответа
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await openai.chat.completions.create({
        model: model || 'gpt-4o',
        messages,
        temperature: temperature || 0,
        response_format: json_response ? { "type": "json_object" } : undefined,
        stream: true,
      });

      for await (const chunk of stream) {
        const chunkStr = chunk.choices[0]?.delta?.content || '';
        res.write(`data: ${JSON.stringify({ chunk: chunkStr })}\n\n`);
      }
      res.end();
    } else {
      // Обработка обычного запроса без потока
      const response = await openai.chat.completions.create({
        model: model || 'gpt-4o',
        messages,
        temperature: temperature || 0,
        response_format: json_response ? { "type": "json_object" } : undefined,
      });

      res.json({ response });
    }
  } catch (error) {
    console.error('Error with OpenAI request:', error);
    res.status(500).json({ error: error.message });
  }
});

// Статический сервинг Vite билда
app.use(express.static('dist'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`OpenAI API key status: ${apiKey ? 'Установлен' : 'Не установлен'}`);
}); 