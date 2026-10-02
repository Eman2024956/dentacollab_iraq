import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/models/app_models.dart';
import '../../../core/services/notification_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _activeFilter = 'all'; // 'all', 'unread'

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      setState(() {
        _searchQuery = _searchController.text.trim();
      });
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<NotificationItemModel> _filterItems(List<NotificationItemModel> items) {
    return items.where((item) {
      if (_activeFilter == 'unread' && item.read) return false;
      if (_searchQuery.isEmpty) return true;
      final q = _searchQuery.toLowerCase();
      return item.title.toLowerCase().contains(q) ||
          item.body.toLowerCase().contains(q);
    }).toList();
  }

  Future<void> _handleDeleteNotification(
    NotificationItemModel item,
    int originalIndex,
  ) async {
    HapticFeedback.mediumImpact();
    await AcademyRepository.deleteNotification(item.id);

    if (!mounted) return;
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.delete_outline, color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'تم حذف "${item.title}"',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontWeight: FontWeight.w500),
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF1E293B),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        duration: const Duration(seconds: 4),
        action: SnackBarAction(
          label: 'تراجع',
          textColor: AppColors.brandMint,
          onPressed: () {
            AcademyRepository.restoreNotification(originalIndex, item);
          },
        ),
      ),
    );
  }

  void _confirmClearAll() {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    showModalBottomSheet(
      context: context,
      backgroundColor: isDark ? AppColors.darkCard : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 44,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.red.withValues(alpha: 0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.delete_sweep_rounded,
                    color: Colors.redAccent,
                    size: 36,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'مسح كافة الإشعارات',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'هل أنت متأكد من رغبتك في حذف جميع التنبيهات من القائمة؟ لا يمكن التراجع عن هذه الخطوة.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: isDark ? Colors.white70 : AppColors.textSecondary,
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => Navigator.pop(context),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: const Text('إلغاء'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () async {
                          Navigator.pop(context);
                          await AcademyRepository.clearAllNotifications();
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: const Text('تم مسح جميع الإشعارات بنجاح'),
                                backgroundColor: const Color(0xFF1E293B),
                                behavior: SnackBarBehavior.floating,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                ),
                              ),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.redAccent,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: const Text('تأكيد المسح'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtitleColor = isDark ? Colors.white60 : AppColors.textSecondary;

    return StreamBuilder<List<NotificationItemModel>>(
      stream: AcademyRepository.streamNotifications(),
      initialData: const [],
      builder: (context, snapshot) {
        final allNotifs = snapshot.data ?? const [];
        final filteredList = _filterItems(allNotifs);
        final unreadCount = allNotifs.where((n) => !n.read).length;

        return Scaffold(
          appBar: AppBar(
            title: const Text(
              'الإشعارات والتنبيهات',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            actions: [
              IconButton(
                tooltip: 'تجربة إشعار منبثق بصوت',
                icon: const Icon(Icons.notifications_active_outlined),
                onPressed: () async {
                  await NotificationService.sendTestNotification();
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Row(
                          children: [
                            Icon(Icons.check_circle_outline, color: AppColors.brandMint),
                            SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                'تم إطلاق إشعار تجريبي بصوت وبانر منبثق بنجاح!',
                              ),
                            ),
                          ],
                        ),
                        backgroundColor: const Color(0xFF1E293B),
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                    );
                  }
                },
              ),
              if (allNotifs.isNotEmpty)
                IconButton(
                  tooltip: 'مسح الكل',
                  icon: const Icon(Icons.delete_sweep_outlined),
                  onPressed: _confirmClearAll,
                ),
            ],
          ),
          body: Column(
            children: [
              // ─── SEARCH TOOLBAR ──────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 10, 16, 10),
                child: Container(
                  decoration: BoxDecoration(
                    color: cardBg,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: _searchQuery.isNotEmpty
                          ? AppColors.primaryTeal
                          : borderColor,
                      width: _searchQuery.isNotEmpty ? 1.5 : 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.04),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: TextField(
                    controller: _searchController,
                    style: TextStyle(color: textColor, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'ابحث في التنبيهات والإشعارات...',
                      hintStyle: TextStyle(
                        color: subtitleColor.withValues(alpha: 0.7),
                        fontSize: 13.5,
                      ),
                      prefixIcon: Icon(
                        Icons.search_rounded,
                        color: _searchQuery.isNotEmpty
                            ? AppColors.primaryTeal
                            : subtitleColor,
                        size: 22,
                      ),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 18),
                              color: subtitleColor,
                              onPressed: () {
                                _searchController.clear();
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 14,
                      ),
                    ),
                  ),
                ),
              ),

              // ─── FILTER TABS & STATS ─────────────────────────────────
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: Row(
                  children: [
                    _buildFilterChip(
                      label: 'الكل (${allNotifs.length})',
                      isSelected: _activeFilter == 'all',
                      onTap: () => setState(() => _activeFilter = 'all'),
                    ),
                    const SizedBox(width: 8),
                    _buildFilterChip(
                      label: 'غير مقروءة ($unreadCount)',
                      isSelected: _activeFilter == 'unread',
                      onTap: () => setState(() => _activeFilter = 'unread'),
                    ),
                    const Spacer(),
                    if (_searchQuery.isNotEmpty)
                      Text(
                        '${filteredList.length} نتائج',
                        style: const TextStyle(
                          color: AppColors.primaryTeal,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                  ],
                ),
              ),

              const SizedBox(height: 6),

              // ─── NOTIFICATIONS LIST WITH SWIPE-TO-DELETE ──────────────
              Expanded(
                child: filteredList.isEmpty
                    ? _buildEmptyState(isDark, subtitleColor)
                    : ListView.builder(
                        padding: const EdgeInsets.fromLTRB(16, 6, 16, 24),
                        itemCount: filteredList.length,
                        itemBuilder: (context, index) {
                          final item = filteredList[index];
                          final originalIndex = allNotifs.indexOf(item);

                          return Dismissible(
                            key: ValueKey(item.id),
                            direction: DismissDirection.horizontal,
                            background: _buildSwipeBackground(
                              alignment: Alignment.centerRight,
                              icon: Icons.delete_outline_rounded,
                              label: 'حذف',
                            ),
                            secondaryBackground: _buildSwipeBackground(
                              alignment: Alignment.centerLeft,
                              icon: Icons.delete_outline_rounded,
                              label: 'حذف',
                            ),
                            onDismissed: (direction) {
                              _handleDeleteNotification(item, originalIndex);
                            },
                            child: InkWell(
                              borderRadius: BorderRadius.circular(20),
                              onTap: () {
                                AcademyRepository.markNotificationAsRead(item.id);
                              },
                              child: Container(
                                margin: const EdgeInsets.only(bottom: 12),
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: cardBg,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                    color: item.read
                                        ? borderColor
                                        : AppColors.primaryTeal.withValues(alpha: 0.45),
                                    width: item.read ? 1 : 1.5,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.primaryTeal.withValues(
                                        alpha: isDark ? 0.08 : 0.04,
                                      ),
                                      blurRadius: 14,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(11),
                                      decoration: BoxDecoration(
                                        color: item.read
                                            ? (isDark
                                                ? AppColors.primaryNavy
                                                : AppColors.softMintBg)
                                            : AppColors.brandMint
                                                .withValues(alpha: 0.22),
                                        borderRadius: BorderRadius.circular(14),
                                      ),
                                      child: Icon(
                                        item.read
                                            ? Icons.notifications_none_rounded
                                            : Icons.notifications_active_rounded,
                                        size: 22,
                                        color: item.read
                                            ? subtitleColor
                                            : AppColors.primaryTeal,
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              Expanded(
                                                child: Text(
                                                  item.title,
                                                  style: TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 13.5,
                                                    color: textColor,
                                                  ),
                                                ),
                                              ),
                                              if (!item.read)
                                                Container(
                                                  width: 8,
                                                  height: 8,
                                                  margin: const EdgeInsets.only(right: 6),
                                                  decoration: const BoxDecoration(
                                                    color: AppColors.primaryTeal,
                                                    shape: BoxShape.circle,
                                                  ),
                                                ),
                                            ],
                                          ),
                                          const SizedBox(height: 5),
                                          Text(
                                            item.body,
                                            style: TextStyle(
                                              color: subtitleColor,
                                              fontSize: 12.2,
                                              height: 1.45,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.access_time_rounded,
                                                size: 13,
                                                color: subtitleColor.withValues(alpha: 0.6),
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                item.time,
                                                style: TextStyle(
                                                  color: subtitleColor.withValues(alpha: 0.65),
                                                  fontSize: 11,
                                                ),
                                              ),
                                              const Spacer(),
                                              Text(
                                                'اسحب للحذف',
                                                style: TextStyle(
                                                  fontSize: 10,
                                                  color: subtitleColor.withValues(alpha: 0.4),
                                                ),
                                              ),
                                              const SizedBox(width: 2),
                                              Icon(
                                                Icons.swipe_outlined,
                                                size: 12,
                                                color: subtitleColor.withValues(alpha: 0.4),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFilterChip({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primaryTeal
              : (isDark ? AppColors.darkCard : AppColors.softMintBg),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected
                ? AppColors.primaryTeal
                : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
            color: isSelected
                ? Colors.white
                : (isDark ? Colors.white70 : AppColors.textPrimary),
          ),
        ),
      ),
    );
  }

  Widget _buildSwipeBackground({
    required Alignment alignment,
    required IconData icon,
    required String label,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 22),
      alignment: alignment,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.red.shade600,
            Colors.red.shade400,
          ],
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 22),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(bool isDark, Color subtitleColor) {
    final isSearching = _searchQuery.isNotEmpty;

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(22),
              decoration: BoxDecoration(
                color: isDark
                    ? AppColors.darkCard
                    : AppColors.brandMint.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: Icon(
                isSearching
                    ? Icons.search_off_rounded
                    : Icons.notifications_none_rounded,
                size: 54,
                color: AppColors.primaryTeal,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              isSearching
                  ? 'لا توجد نتائج مطابقة لبحثك'
                  : 'لا توجد إشعارات جديدة حالياً',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              isSearching
                  ? 'جرّب البحث بكلمات أخرى'
                  : 'عند إرسال تنبيه أو إشعار جديد من لوحة الإدارة، سيظهر هنا فوراً وبشكل حي.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: subtitleColor,
                height: 1.5,
              ),
            ),
            if (isSearching) ...[
              const SizedBox(height: 20),
              OutlinedButton.icon(
                onPressed: () {
                  _searchController.clear();
                },
                icon: const Icon(Icons.clear_rounded, size: 18),
                label: const Text('مسح البحث'),
                style: OutlinedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
