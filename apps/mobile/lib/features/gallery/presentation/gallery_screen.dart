import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/data/academy_repository.dart';
import '../../../core/models/app_models.dart';
import '../../../core/widgets/app_image_widget.dart';

class GalleryScreen extends StatefulWidget {
  final String? initialAlbumId;
  const GalleryScreen({super.key, this.initialAlbumId});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  String _selectedCategory = 'الكل';

  final List<String> _categories = [
    'الكل',
    'سير العمل',
    'تخطيط الزرعات',
    'قبل وبعد',
    'الطباعة ثلاثية الأبعاد',
    'المختبر الرقمي',
    'أجهزة ومعدات',
    'ورش العمل',
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = isDark ? AppColors.darkBackground : AppColors.lightBackground;
    final cardBg = isDark ? AppColors.darkCard : Colors.white;
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor = isDark ? Colors.white : AppColors.textPrimary;
    final subtextColor = isDark ? Colors.white70 : AppColors.textSecondary;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: bg,
        elevation: 0,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: AppColors.mintCyanGradient,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.collections_outlined, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'معرض التقنيات والأعمال',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const Text(
                  'صور ودفعات العمل الرقمي التخصصي',
                  style: TextStyle(
                    fontSize: 10.5,
                    color: AppColors.primaryTeal,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Categories Filter Chips
          SizedBox(
            height: 48,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final cat = _categories[index];
                final isSelected = cat == _selectedCategory;

                return Padding(
                  padding: const EdgeInsets.only(left: 8),
                  child: FilterChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        _selectedCategory = cat;
                      });
                    },
                    backgroundColor: cardBg,
                    selectedColor: AppColors.primaryTeal,
                    checkmarkColor: Colors.white,
                    labelStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      color: isSelected ? Colors.white : textColor,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isSelected ? AppColors.primaryTeal : borderColor,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 6),

          // Albums List
          Expanded(
            child: StreamBuilder<List<GalleryAlbumModel>>(
              stream: AcademyRepository.streamGallery(),
              builder: (context, snapshot) {
                final allAlbums = snapshot.data ?? const <GalleryAlbumModel>[];
                final filtered = _selectedCategory == 'الكل'
                    ? allAlbums
                    : allAlbums.where((a) => a.category == _selectedCategory).toList();

                if (filtered.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.photo_library_outlined, size: 54, color: subtextColor),
                        const SizedBox(height: 12),
                        Text(
                          'لا توجد صور في هذا التصنيف حالياً',
                          style: TextStyle(fontSize: 14, color: subtextColor),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final album = filtered[index];
                    return _buildAlbumCard(
                      context,
                      album,
                      cardBg: cardBg,
                      borderColor: borderColor,
                      textColor: textColor,
                      subtextColor: subtextColor,
                      isDark: isDark,
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAlbumCard(
    BuildContext context,
    GalleryAlbumModel album, {
    required Color cardBg,
    required Color borderColor,
    required Color textColor,
    required Color subtextColor,
    required bool isDark,
  }) {
    final images = album.images;
    final imageCount = images.length;

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryTeal.withValues(alpha: isDark ? 0.05 : 0.06),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Info
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.softMintBg,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              album.category,
                              style: const TextStyle(
                                color: AppColors.primaryTeal,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.darkBackground : const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.photo_library_outlined, size: 11, color: subtextColor),
                                const SizedBox(width: 4),
                                Text(
                                  '$imageCount صور',
                                  style: TextStyle(fontSize: 10, color: subtextColor, fontWeight: FontWeight.w600),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        album.title.ar,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      if (album.description.ar.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          album.description.ar,
                          style: TextStyle(
                            fontSize: 12,
                            color: subtextColor,
                            height: 1.35,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Dynamic Batch Images Section
          if (imageCount == 0)
            Container(
              height: 120,
              margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkBackground : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text('لا توجد صور في هذا الألبوم', style: TextStyle(color: subtextColor, fontSize: 12)),
              ),
            )
          else if (imageCount == 1)
            // Single large image
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              child: GestureDetector(
                onTap: () => _openLightbox(context, album, 0),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Stack(
                    children: [
                      AppImageWidget(
                        imagePathOrUrl: images[0],
                        height: 200,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                      Positioned(
                        bottom: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.black54,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.fullscreen, color: Colors.white, size: 18),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
          else
            // Batch Images Grid / Strip
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              child: _buildBatchImagesGrid(context, album, isDark),
            ),

          // Bottom Action Bar
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 6, 14, 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'دفعة صور رقمية (${images.length})',
                  style: TextStyle(fontSize: 11, color: subtextColor, fontWeight: FontWeight.w500),
                ),
                InkWell(
                  borderRadius: BorderRadius.circular(10),
                  onTap: () => _openLightbox(context, album, 0),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: AppColors.brandMint.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Text(
                          'استعراض كامل بالمعرض',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryTeal,
                          ),
                        ),
                        SizedBox(width: 4),
                        Icon(Icons.arrow_forward, size: 12, color: AppColors.primaryTeal),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBatchImagesGrid(BuildContext context, GalleryAlbumModel album, bool isDark) {
    final images = album.images;
    final displayCount = images.length > 4 ? 4 : images.length;

    return Row(
      children: List.generate(displayCount, (index) {
        final isLast = index == 3 && images.length > 4;
        final extraCount = images.length - 4;

        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(left: index == displayCount - 1 ? 0 : 6),
            child: GestureDetector(
              onTap: () => _openLightbox(context, album, index),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Stack(
                  children: [
                    AppImageWidget(
                      imagePathOrUrl: images[index],
                      height: 85,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                    if (isLast)
                      Positioned.fill(
                        child: Container(
                          color: Colors.black.withValues(alpha: 0.65),
                          child: Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.add, color: Colors.white, size: 16),
                                Text(
                                  '$extraCount',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        );
      }),
    );
  }

  void _openLightbox(BuildContext context, GalleryAlbumModel album, int initialIndex) {
    if (album.images.isEmpty) return;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => GalleryPhotoViewer(
          album: album,
          initialIndex: initialIndex,
        ),
      ),
    );
  }
}

/// Full screen Interactive Lightbox Photo Viewer for batch images
class GalleryPhotoViewer extends StatefulWidget {
  final GalleryAlbumModel album;
  final int initialIndex;

  const GalleryPhotoViewer({
    super.key,
    required this.album,
    this.initialIndex = 0,
  });

  @override
  State<GalleryPhotoViewer> createState() => _GalleryPhotoViewerState();
}

class _GalleryPhotoViewerState extends State<GalleryPhotoViewer> {
  late PageController _pageController;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex.clamp(0, widget.album.images.length - 1);
    _pageController = PageController(initialPage: _currentIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final images = widget.album.images;

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Stack(
          children: [
            // Swipeable zoomable image pager
            PageView.builder(
              controller: _pageController,
              itemCount: images.length,
              onPageChanged: (idx) {
                setState(() {
                  _currentIndex = idx;
                });
              },
              itemBuilder: (context, index) {
                return InteractiveViewer(
                  minScale: 0.8,
                  maxScale: 4.0,
                  child: Center(
                    child: AppImageWidget(
                      imagePathOrUrl: images[index],
                      fit: BoxFit.contain,
                    ),
                  ),
                );
              },
            ),

            // Top Control Bar
            Positioned(
              top: 0,
              left: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Colors.black87, Colors.transparent],
                  ),
                ),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white, size: 24),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            widget.album.title.ar,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            'صورة ${_currentIndex + 1} من ${images.length}',
                            style: const TextStyle(
                              color: AppColors.brandMint,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Thumbnails Strip
            if (images.length > 1)
              Positioned(
                bottom: 12,
                left: 0,
                right: 0,
                child: Container(
                  height: 60,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: images.length,
                    itemBuilder: (context, index) {
                      final isSelected = index == _currentIndex;

                      return GestureDetector(
                        onTap: () {
                          _pageController.animateToPage(
                            index,
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeInOut,
                          );
                        },
                        child: Container(
                          width: 50,
                          height: 50,
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: isSelected ? AppColors.brandMint : Colors.white24,
                              width: isSelected ? 2.5 : 1,
                            ),
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(6),
                            child: AppImageWidget(
                              imagePathOrUrl: images[index],
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
