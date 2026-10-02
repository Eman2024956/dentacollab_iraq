import 'dart:async';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../models/app_models.dart';
import '../data/academy_repository.dart';
import 'app_image_widget.dart';
import '../../features/courses/presentation/courses_screen.dart';
import '../../features/workshops/presentation/workshops_screen.dart';
import '../../features/services/presentation/services_screen.dart';

class HeroSliderBannerWidget extends StatefulWidget {
  const HeroSliderBannerWidget({super.key});

  @override
  State<HeroSliderBannerWidget> createState() => _HeroSliderBannerWidgetState();
}

class _HeroSliderBannerWidgetState extends State<HeroSliderBannerWidget> {
  late final PageController _pageController;
  // Memoized stream - created once in initState() to avoid creating new Firestore
  // subscriptions on every rebuild (which causes infinite CPU loops).
  late final Stream<HeroBannerSettingsModel> _bannerStream;
  Timer? _autoScrollTimer;
  int _currentPage = 0;
  bool _isAutoScrolling = false;
  int? _lastInterval;
  int? _lastSlideCount;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    _bannerStream = AcademyRepository.streamHeroBannerSettings();
  }

  void _setupAutoScroll(HeroBannerSettingsModel settings) {
    if (!settings.enableAnimation || settings.slides.length <= 1) {
      _stopAutoScroll();
      return;
    }

    if (_isAutoScrolling &&
        _lastInterval == settings.animationIntervalSeconds &&
        _lastSlideCount == settings.slides.length) {
      return;
    }

    _stopAutoScroll();
    _isAutoScrolling = true;
    _lastInterval = settings.animationIntervalSeconds;
    _lastSlideCount = settings.slides.length;

    final interval = Duration(seconds: settings.animationIntervalSeconds);
    _autoScrollTimer = Timer.periodic(interval, (_) {
      if (!_pageController.hasClients || settings.slides.isEmpty) return;
      final nextPage = (_currentPage + 1) % settings.slides.length;
      _pageController.animateToPage(
        nextPage,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOutCubic,
      );
    });
  }

  void _stopAutoScroll() {
    _autoScrollTimer?.cancel();
    _autoScrollTimer = null;
    _isAutoScrolling = false;
    _lastInterval = null;
    _lastSlideCount = null;
  }

  @override
  void dispose() {
    _stopAutoScroll();
    _pageController.dispose();
    super.dispose();
  }

  void _handleAction(BuildContext context, String actionType) {
    switch (actionType) {
      case 'courses':
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const CoursesScreen()),
        );
        break;
      case 'workshops':
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const WorkshopsScreen()),
        );
        break;
      case 'services':
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const ServicesScreen()),
        );
        break;
      default:
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return StreamBuilder<HeroBannerSettingsModel>(
      stream: _bannerStream,
      initialData: HeroBannerSettingsModel.fallback(),
      builder: (context, snapshot) {
        final settings = snapshot.data ?? HeroBannerSettingsModel.fallback();

        // 1. If Hidden by Admin Toggle: Hide completely
        if (!settings.isVisible) {
          _stopAutoScroll();
          return const SizedBox.shrink();
        }

        // 2. Setup or Stop Animation based on Admin Toggle
        if (settings.enableAnimation) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (mounted) _setupAutoScroll(settings);
          });
        } else {
          _stopAutoScroll();
        }

        final slides = settings.slides.isNotEmpty
            ? settings.slides
            : HeroBannerSettingsModel.fallback().slides;

        if (_currentPage >= slides.length) {
          _currentPage = 0;
        }

        return Column(
          children: [
            Padding(
              // Consistent directional padding — 16 on both sides, 8 top/bottom
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
              child: ConstrainedBox(
                constraints: const BoxConstraints(minHeight: 170, maxHeight: 230),
                child: PageView.builder(
                controller: _pageController,
                itemCount: slides.length,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemBuilder: (context, index) {
                  final slide = slides[index];

                  return Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: isDark
                          ? AppColors.heroBannerDarkGradient
                          : AppColors.heroBannerGradient,
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.brandMint.withValues(alpha: isDark ? 0.15 : 0.25),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        // Translucent background watermark if image exists
                        if (slide.image.isNotEmpty)
                          Positioned(
                            left: 0,
                            bottom: 0,
                            top: 0,
                            width: 140,
                            child: Opacity(
                              opacity: 0.18,
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(20),
                                child: AppImageWidget(
                                  imagePathOrUrl: slide.image,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                          ),

                        // Main Slide Content
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            // Text Details & Action Button
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                      // Tag Pill
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withValues(alpha: 0.22),
                                          borderRadius: BorderRadius.circular(20),
                                        ),
                                        child: Text(
                                          slide.tag,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      const SizedBox(height: 8),

                                      // Title
                                      Text(
                                        slide.title,
                                        style: const TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                          height: 1.15,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 5),

                                      // Description
                                      Text(
                                        slide.description,
                                        style: TextStyle(
                                          fontSize: 11.5,
                                          color: Colors.white.withValues(alpha: 0.92),
                                          height: 1.4,
                                        ),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                  // Explicit 18px gap between description and CTA
                                  // (replaces the spaceBetween that caused the empty void)
                                  if (slide.actionText.isNotEmpty)
                                    const SizedBox(height: 18),

                                  // CTA Button — aligned to logical start (RTL-aware)
                                  if (slide.actionText.isNotEmpty)
                                    InkWell(
                                        onTap: () => _handleAction(context, slide.actionType),
                                        borderRadius: BorderRadius.circular(16),
                                        child: Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                                          decoration: BoxDecoration(
                                            color: Colors.white.withValues(alpha: 0.95),
                                            borderRadius: BorderRadius.circular(16),
                                            boxShadow: [
                                              BoxShadow(
                                                color: Colors.black.withValues(alpha: 0.1),
                                                blurRadius: 6,
                                                offset: const Offset(0, 2),
                                              ),
                                            ],
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Text(
                                                slide.actionText,
                                                style: const TextStyle(
                                                  color: AppColors.primaryTeal,
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 11.5,
                                                ),
                                              ),
                                              const SizedBox(width: 4),
                                              const Icon(
                                                Icons.arrow_forward,
                                                size: 13,
                                                color: AppColors.primaryTeal,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                ],
                              ),
                            ),

                            // If Slide has an Image, display a crisp visual thumbnail
                            if (slide.image.isNotEmpty) ...[
                              const SizedBox(width: 12),
                              Align(
                                alignment: Alignment.center,
                                child: Container(
                                  width: 82,
                                  height: 82,
                                  decoration: BoxDecoration(
                                    color: Colors.white.withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(18),
                                    border: Border.all(
                                      color: Colors.white.withValues(alpha: 0.4),
                                      width: 1.8,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withValues(alpha: 0.15),
                                        blurRadius: 10,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: ClipRRect(
                                    borderRadius: BorderRadius.circular(16),
                                    child: AppImageWidget(
                                      imagePathOrUrl: slide.image,
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  );
                },
                ),
              ),
            ),

            // Pagination Dots Indicator
            if (slides.length > 1) ...[
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(slides.length, (i) {
                  final isActive = i == _currentPage;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    width: isActive ? 22 : 6,
                    height: 5,
                    decoration: BoxDecoration(
                      color: isActive
                          ? AppColors.primaryTeal
                          : (isDark ? Colors.white24 : Colors.black12),
                      borderRadius: BorderRadius.circular(3),
                    ),
                  );
                }),
              ),
            ],
            const SizedBox(height: 12),
          ],
        );
      },
    );
  }
}
