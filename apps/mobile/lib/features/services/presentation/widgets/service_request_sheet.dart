import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../core/theme/app_colors.dart';

class ServiceRequestSheet extends StatefulWidget {
  final String serviceTitle;
  final String serviceId;

  const ServiceRequestSheet({
    super.key,
    required this.serviceTitle,
    required this.serviceId,
  });

  @override
  State<ServiceRequestSheet> createState() => _ServiceRequestSheetState();
}

class _ServiceRequestSheetState extends State<ServiceRequestSheet> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController(text: 'د. علي حسين السعدي');
  final _phoneController = TextEditingController(text: '+964 781 782 8545');
  final _descController = TextEditingController();
  String _preferredContact = 'whatsapp';
  bool _submitting = false;

  Future<void> _submitRequest() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _submitting = true);

    try {
      final nowIso = DateTime.now().toUtc().toIso8601String();
      final docRef = await FirebaseFirestore.instance.collection('serviceRequests').add({
        'serviceId': widget.serviceId,
        'serviceTitle': widget.serviceTitle,
        'studentName': _nameController.text.trim(),
        'studentPhone': _phoneController.text.trim(),
        'description': _descController.text.trim(),
        'preferredContactMethod': _preferredContact,
        'status': 'under_review',
        'createdAt': nowIso,
        'updatedAt': nowIso,
      });

      if (!mounted) return;
      Navigator.pop(context);

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppColors.success,
          content: Text('تم إرسال طلب الخدمة بنجاح (${docRef.id})! سيتواصل معك كادر الأكاديمية لمراجعة الحالة ✅'),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppColors.error,
          content: Text('حدث خطأ أثناء إرسال الطلب: $e'),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _submitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final inputBg = isDark ? AppColors.primaryNavy : AppColors.softMintBg;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.brandMint.withValues(alpha: 0.25);

    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 5,
                  decoration: BoxDecoration(
                    color: borderColor,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                'طلب استشارة أو خدمة رقمية',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
              ),
              const SizedBox(height: 4),
              Text(
                widget.serviceTitle,
                style: const TextStyle(fontSize: 13, color: AppColors.primaryTeal, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 18),

              // Name input
              TextFormField(
                controller: _nameController,
                style: TextStyle(color: textColor, fontSize: 13.5),
                decoration: InputDecoration(
                  labelText: 'الاسم الكامل للطبيب / المركز',
                  labelStyle: TextStyle(color: subtitleColor, fontSize: 12),
                  filled: true,
                  fillColor: inputBg,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: borderColor)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: borderColor)),
                ),
                validator: (val) => val == null || val.isEmpty ? 'يرجى إدخال الاسم' : null,
              ),
              const SizedBox(height: 14),

              // Phone
              TextFormField(
                controller: _phoneController,
                style: TextStyle(color: textColor, fontSize: 13.5),
                decoration: InputDecoration(
                  labelText: 'رقم الهاتف (واتساب)',
                  labelStyle: TextStyle(color: subtitleColor, fontSize: 12),
                  filled: true,
                  fillColor: inputBg,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: borderColor)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: borderColor)),
                ),
                validator: (val) => val == null || val.isEmpty ? 'يرجى إدخال رقم الهاتف' : null,
              ),
              const SizedBox(height: 14),

              // Description
              TextFormField(
                controller: _descController,
                maxLines: 3,
                style: TextStyle(color: textColor, fontSize: 13.5),
                decoration: InputDecoration(
                  labelText: 'تفاصيل الحالة أو الملاحظات السريرية',
                  hintText: 'مثال: تفاصيل السن والزرعة، نظام الأكمام، توفر ملفات CBCT أو STL...',
                  hintStyle: TextStyle(color: subtitleColor.withValues(alpha: 0.5), fontSize: 11.5),
                  labelStyle: TextStyle(color: subtitleColor, fontSize: 12),
                  filled: true,
                  fillColor: inputBg,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: borderColor)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide(color: borderColor)),
                ),
              ),
              const SizedBox(height: 16),

              // Preferred contact method
              Text('طريقة التواصل المفضلة:', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: textColor)),
              const SizedBox(height: 8),
              Row(
                children: [
                  ChoiceChip(
                    label: const Text('واتساب (WhatsApp)'),
                    selected: _preferredContact == 'whatsapp',
                    selectedColor: AppColors.primaryTeal,
                    backgroundColor: inputBg,
                    labelStyle: TextStyle(
                      color: _preferredContact == 'whatsapp' ? Colors.white : textColor,
                      fontSize: 11.5,
                      fontWeight: FontWeight.bold,
                    ),
                    onSelected: (val) {
                      if (val) setState(() => _preferredContact = 'whatsapp');
                    },
                  ),
                  const SizedBox(width: 8),
                  ChoiceChip(
                    label: const Text('اتصال هاتفي'),
                    selected: _preferredContact == 'phone',
                    selectedColor: AppColors.primaryTeal,
                    backgroundColor: inputBg,
                    labelStyle: TextStyle(
                      color: _preferredContact == 'phone' ? Colors.white : textColor,
                      fontSize: 11.5,
                      fontWeight: FontWeight.bold,
                    ),
                    onSelected: (val) {
                      if (val) setState(() => _preferredContact = 'phone');
                    },
                  ),
                ],
              ),
              const SizedBox(height: 22),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _submitRequest,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryTeal,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                    elevation: 0,
                  ),
                  child: _submitting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text(
                          'تأكيد وإرسال الطلب',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
