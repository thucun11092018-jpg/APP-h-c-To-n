import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import cors from 'cors';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // API Routes FIRST
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ text: "Lỗi hệ thống: Chưa cấu hình API Key. Vui lòng thiết lập API Key trong cài đặt." });
      }

      const ai = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const chat = ai.chats.create({
        model: "gemini-3.7-flash",
        config: {
          systemInstruction: "Bạn là một cô giáo dạy Toán lớp 10 thân thiện, nhiệt tình. Bạn đang hướng dẫn học sinh Bài 1: Mệnh đề (chương trình GDPT mới). Hãy giải thích dễ hiểu, có ví dụ minh họa bằng tiếng Việt. Dùng từ ngữ gần gũi với học sinh trung học phổ thông, luôn xưng 'cô' và gọi người dùng là 'em'. NGUYÊN TẮC QUAN TRỌNG NHẤT: Khi học sinh yêu cầu giải một bài toán, TUYỆT ĐỐI KHÔNG đưa ra lời giải hoàn chỉnh ngay. Thay vào đó, cô phải hướng dẫn học sinh làm TỪNG BƯỚC. Với mỗi bước, hãy gợi mở và yêu cầu học sinh làm rồi trả lời. CHỈ KHI học sinh trả lời đúng bước hiện tại, cô mới chuyển sang bước tiếp theo. Nếu học sinh làm sai, hãy động viên và đưa ra gợi ý nhẹ nhàng để em tự sửa. Nếu học sinh hỏi điều gì ngoài phạm vi Toán học, hãy lịch sự lái câu chuyện quay về môn Toán.",
        },
      });

      // Bổ sung lịch sử nếu có
      if (history && history.length > 1) {
        // We could load history, but for simplicity we will just append the message to the default chat
        // The sdk allows adding history if we define it in the chat config, but for now we just use a simple conversation.
      }

      // Format history to genai standard
      const formattedHistory = (history || []).map((h: any) => ({
        role: h.role, // 'user' or 'model'
        parts: h.parts // [{text: '...'}]
      }));

      const chatWithHistory = ai.chats.create({
        model: "gemini-3.7-flash",
        config: {
          systemInstruction: "Bạn là một cô giáo dạy Toán lớp 10 thân thiện, nhiệt tình. Bạn đang hướng dẫn học sinh Bài 1: Mệnh đề (chương trình GDPT mới). Hãy giải thích dễ hiểu, có ví dụ minh họa bằng tiếng Việt. Dùng từ ngữ gần gũi với học sinh trung học phổ thông, luôn xưng 'cô' và gọi người dùng là 'em'. NGUYÊN TẮC QUAN TRỌNG NHẤT: Khi học sinh yêu cầu giải một bài toán, TUYỆT ĐỐI KHÔNG đưa ra lời giải hoàn chỉnh ngay. Thay vào đó, cô phải hướng dẫn học sinh làm TỪNG BƯỚC. Với mỗi bước, hãy gợi mở và yêu cầu học sinh làm rồi trả lời. CHỈ KHI học sinh trả lời đúng bước hiện tại, cô mới chuyển sang bước tiếp theo. Nếu học sinh làm sai, hãy động viên và đưa ra gợi ý nhẹ nhàng để em tự sửa. Nếu học sinh hỏi điều gì ngoài phạm vi Toán học, hãy lịch sự lái câu chuyện quay về môn Toán.",
        },
        history: formattedHistory,
      });


      const response = await chatWithHistory.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      
      // Handle high demand errors gracefully
      let errorMessage = `Đã có lỗi xảy ra: ${error.message || JSON.stringify(error)}`;
      if (error.status === 503 || (error.message && error.message.includes("high demand"))) {
         errorMessage = "Hệ thống AI hiện đang quá tải do có nhiều học sinh truy cập cùng lúc. Em vui lòng thử lại sau vài giây nhé!";
      }
      
      res.status(500).json({ text: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
