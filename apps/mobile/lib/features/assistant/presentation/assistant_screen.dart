import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class AssistantScreen extends StatefulWidget {
  const AssistantScreen({super.key});

  @override
  State<AssistantScreen> createState() => _AssistantScreenState();
}

class _AssistantScreenState extends State<AssistantScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [
    {
      'role': 'assistant',
      'text': 'أهلاً بك دكتور! أنا المساعد الأكاديمي لـ DentaCollab في بغداد. كيف يمكنني مساعدتك اليوم في برامج التصميم الرقمي أو مواعيد الدفعات؟',
    },
  ];
  bool _loading = false;

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({'role': 'user', 'text': text});
      _controller.clear();
      _loading = true;
    });

    // Simulate smart bounded answer
    Future.delayed(const Duration(milliseconds: 700), () {
      String reply = 'أكاديمية DentaCollab في بغداد تقدم تدريباً عملياً فردياً على برمجيات Exocad و Exoplan بأحدث محطات العمل. يمكنك التسجيل مباشرة في الدفعة القادمة عبر قائمة الدورات.';
      final lower = text.toLowerCase();
      if (lower.contains('exocad') || lower.contains('تصميم')) {
        reply = 'دورة أساسيات طب الأسنان الرقمي (Exocad) تغطي تصميم التيجان والجسور والابتسامة الرقمية خلال ٤ أسابيع بمقرنا في بغداد.';
      } else if (lower.contains('زرع') || lower.contains('exoplan')) {
        reply = 'دورة تخطيط الزرعات Exoplan تعتمد على دراسة وتحليل صور CBCT وتصميم الأدلة الجراحية الجاهزة للطباعة ثلاثية الأبعاد.';
      } else if (lower.contains('شهادة') || lower.contains('certificate')) {
        reply = 'نعم، يحصل كل متدرب على شهادة إتمام رقمية مزودة برمز QR فريد يمكن التحقق منه إلكترونياً.';
      }

      setState(() {
        _loading = false;
        _messages.add({'role': 'assistant', 'text': reply});
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.auto_awesome, color: AppColors.brandCyan, size: 18),
            SizedBox(width: 8),
            Text('المساعد الأكاديمي الذكي', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerLeft : Alignment.centerRight,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(14),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                    decoration: BoxDecoration(
                      color: isUser ? AppColors.brandCyan : AppColors.darkCard,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isUser ? AppColors.brandCyan : AppColors.darkBorder,
                      ),
                    ),
                    child: Text(
                      msg['text']!,
                      style: TextStyle(
                        color: isUser ? AppColors.darkBackground : Colors.white,
                        fontSize: 13,
                        fontWeight: isUser ? FontWeight.w600 : FontWeight.normal,
                        height: 1.4,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_loading)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Align(
                alignment: Alignment.centerRight,
                child: Text('المساعد يكتب...', style: TextStyle(color: Colors.white54, fontSize: 11)),
              ),
            ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: AppColors.darkCard,
              border: Border(top: BorderSide(color: AppColors.darkBorder)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      onSubmitted: (_) => _sendMessage(),
                      decoration: InputDecoration(
                        hintText: 'اسأل عن الدورات، المواعيد، أو المنهج...',
                        hintStyle: const TextStyle(color: Colors.white38, fontSize: 12),
                        filled: true,
                        fillColor: AppColors.primaryNavy,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(20),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    onPressed: _sendMessage,
                    icon: const Icon(Icons.send, color: AppColors.brandCyan),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
