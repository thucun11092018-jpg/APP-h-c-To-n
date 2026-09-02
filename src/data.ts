import { Question, GameItem } from './types';

export const questionBank: Question[] = [
  {
    id: 'q1',
    text: 'Trong các câu sau, câu nào là một mệnh đề?',
    options: [
      'Trời hôm nay đẹp quá!',
      'Bạn đã làm bài tập chưa?',
      'Số 15 là số nguyên tố.',
      'Hãy đi học đi!'
    ],
    correctAnswerIndex: 2,
    difficulty: 'Nhận biết',
    explanation: 'Mệnh đề là câu khẳng định có tính đúng hoặc sai. "Số 15 là số nguyên tố" là khẳng định sai, nên nó là mệnh đề.'
  },
  {
    id: 'q2',
    text: 'Mệnh đề phủ định của mệnh đề P: "Mọi số thực đều có bình phương lớn hơn hoặc bằng 0" là gì?',
    options: [
      'Có một số thực mà bình phương của nó nhỏ hơn 0.',
      'Mọi số thực đều có bình phương nhỏ hơn 0.',
      'Có một số thực mà bình phương của nó lớn hơn 0.',
      'Mọi số thực đều có bình phương bằng 0.'
    ],
    correctAnswerIndex: 0,
    difficulty: 'Thông hiểu',
    explanation: 'Phủ định của "Mọi x, P(x)" là "Tồn tại x, không P(x)".'
  },
  {
    id: 'q3',
    text: 'Cho mệnh đề "Nếu tam giác ABC đều thì tam giác ABC cân". Đây là loại mệnh đề gì?',
    options: [
      'Mệnh đề tương đương',
      'Mệnh đề kéo theo',
      'Mệnh đề phủ định',
      'Mệnh đề chứa biến'
    ],
    correctAnswerIndex: 1,
    difficulty: 'Nhận biết',
    explanation: 'Mệnh đề có dạng "Nếu P thì Q" (P => Q) gọi là mệnh đề kéo theo.'
  },
  {
    id: 'q4',
    text: 'Mệnh đề "Số 6 chia hết cho 2 và 3" là mệnh đề đúng hay sai?',
    options: [
      'Đúng',
      'Sai',
      'Không xác định được',
      'Không phải mệnh đề'
    ],
    correctAnswerIndex: 0,
    difficulty: 'Nhận biết',
    explanation: 'Vì 6 chia hết cho 2 và 6 chia hết cho 3 đều đúng.'
  },
  {
    id: 'q5',
    text: 'Trong các mệnh đề sau, mệnh đề nào sai?',
    options: [
      'π là một số vô tỉ.',
      'Hai tam giác bằng nhau thì có diện tích bằng nhau.',
      'Số 2 là số nguyên tố chẵn duy nhất.',
      'Mọi số nguyên tố đều là số lẻ.'
    ],
    correctAnswerIndex: 3,
    difficulty: 'Thông hiểu',
    explanation: 'Sai vì số 2 là số nguyên tố nhưng là số chẵn.'
  },
  {
    id: 'q6',
    text: 'Kí hiệu tồn tại (∃) được đọc là gì?',
    options: [
      'Với mọi',
      'Có ít nhất một',
      'Thuộc',
      'Chứa'
    ],
    correctAnswerIndex: 1,
    difficulty: 'Nhận biết',
    explanation: 'Kí hiệu ∃ đọc là "tồn tại", "có ít nhất một" hoặc "có một".'
  },
  {
    id: 'q7',
    text: 'Cho định lí: "Nếu hai góc đối đỉnh thì chúng bằng nhau". Giả thiết của định lí là gì?',
    options: [
      'Hai góc đối đỉnh',
      'Chúng bằng nhau',
      'Nếu hai góc đối đỉnh',
      'Hai góc'
    ],
    correctAnswerIndex: 0,
    difficulty: 'Thông hiểu',
    explanation: 'Trong định lí "Nếu P thì Q", P là giả thiết, Q là kết luận.'
  },
  {
    id: 'q8',
    text: 'Cho mệnh đề P: "Phương trình x^2 - 4 = 0 có nghiệm". Mệnh đề phủ định của P là:',
    options: [
      'Phương trình x^2 - 4 = 0 vô nghiệm.',
      'Phương trình x^2 - 4 = 0 có 2 nghiệm.',
      'Phương trình x^2 - 4 > 0 vô nghiệm.',
      'Phương trình x^2 - 4 ≠ 0 có nghiệm.'
    ],
    correctAnswerIndex: 0,
    difficulty: 'Thông hiểu',
    explanation: 'Phủ định của "có nghiệm" là "không có nghiệm" (vô nghiệm).'
  },
  {
    id: 'q9',
    text: 'Mệnh đề tương đương P ⇔ Q đúng khi nào?',
    options: [
      'P và Q cùng đúng.',
      'P và Q cùng sai.',
      'P và Q có cùng tính chân lí (cùng đúng hoặc cùng sai).',
      'P đúng, Q sai.'
    ],
    correctAnswerIndex: 2,
    difficulty: 'Vận dụng',
    explanation: 'Mệnh đề tương đương P ⇔ Q đúng khi cả P và Q đều cùng đúng hoặc cùng sai.'
  },
  {
    id: 'q10',
    text: 'Với giá trị nào của x thì mệnh đề chứa biến P(x): "x^2 - 1 = 0" là mệnh đề đúng?',
    options: [
      'x = 0',
      'x = 2',
      'x = 1 hoặc x = -1',
      'Không có giá trị nào'
    ],
    correctAnswerIndex: 2,
    difficulty: 'Thông hiểu',
    explanation: 'Thay x = 1 hoặc x = -1 vào ta được 1 - 1 = 0 (đúng).'
  },
  {
    id: 'q11',
    text: 'Cho mệnh đề P => Q. Mệnh đề đảo của nó là:',
    options: [
      'Q => P',
      'Không P => Không Q',
      'Không Q => Không P',
      'P ⇔ Q'
    ],
    correctAnswerIndex: 0,
    difficulty: 'Vận dụng',
    explanation: 'Mệnh đề đảo của P => Q chính là Q => P.'
  },
  {
    id: 'q12',
    text: 'Câu nào là mệnh đề chứa biến?',
    options: [
      '2 + 3 = 5',
      'x + 3 > 5',
      'Hà Nội là thủ đô của Việt Nam',
      'Số 9 là số chính phương'
    ],
    correctAnswerIndex: 1,
    difficulty: 'Nhận biết',
    explanation: '"x + 3 > 5" chứa biến x, tính đúng/sai phụ thuộc vào giá trị của x nên nó là mệnh đề chứa biến.'
  }
];

export const gameItems: GameItem[] = [
  { id: 'g1', text: '1 + 1 = 3', isProposition: true, explanation: 'Là câu khẳng định (sai), nên là mệnh đề.' },
  { id: 'g2', text: 'Hôm nay trời đẹp quá!', isProposition: false, explanation: 'Là câu cảm thán, không phải mệnh đề.' },
  { id: 'g3', text: 'Mấy giờ rồi?', isProposition: false, explanation: 'Là câu hỏi, không phải mệnh đề.' },
  { id: 'g4', text: 'Paris là thủ đô của nước Pháp.', isProposition: true, explanation: 'Là câu khẳng định (đúng), nên là mệnh đề.' },
  { id: 'g5', text: 'x + 5 = 10', isProposition: false, explanation: 'Là mệnh đề chứa biến, không phải mệnh đề (vì chưa biết x).' },
  { id: 'g6', text: 'Số 4 là số nguyên tố.', isProposition: true, explanation: 'Là câu khẳng định (sai), nên là mệnh đề.' },
  { id: 'g7', text: 'Hãy mở cửa ra!', isProposition: false, explanation: 'Là câu cầu khiến, không phải mệnh đề.' },
  { id: 'g8', text: 'Năm 2024 là năm nhuận.', isProposition: true, explanation: 'Là câu khẳng định (đúng), nên là mệnh đề.' }
];
