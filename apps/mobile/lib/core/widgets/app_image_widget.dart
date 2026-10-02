import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// A robust image widget that dynamically supports:
/// 1. Firebase Storage / Remote Network URLs (`http://`, `https://`)
/// 2. Local Asset Images (`assets/...` or filename in `assets/images/`)
/// 3. Graceful loading state and error fallbacks
class AppImageWidget extends StatelessWidget {
  final String imagePathOrUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadius? borderRadius;
  final Widget? placeholder;
  final Widget? errorWidget;

  const AppImageWidget({
    super.key,
    required this.imagePathOrUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
    this.placeholder,
    this.errorWidget,
  });

  @override
  Widget build(BuildContext context) {
    final cleanPath = imagePathOrUrl.trim();

    Widget imageWidget;

    if (cleanPath.isEmpty) {
      imageWidget = _buildFallback();
    } else if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      imageWidget = Image.network(
        cleanPath,
        width: width,
        height: height,
        fit: fit,
        loadingBuilder: (context, child, loadingProgress) {
          if (loadingProgress == null) return child;
          return placeholder ??
              Container(
                width: width,
                height: height,
                color: AppColors.primaryTeal.withValues(alpha: 0.08),
                child: const Center(
                  child: SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(AppColors.primaryTeal),
                    ),
                  ),
                ),
              );
        },
        errorBuilder: (context, error, stackTrace) => _buildFallback(),
      );
    } else {
      // Local asset
      final assetPath = cleanPath.startsWith('assets/')
          ? cleanPath
          : 'assets/images/$cleanPath';

      imageWidget = Image.asset(
        assetPath,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) => _buildFallback(),
      );
    }

    if (borderRadius != null) {
      return ClipRRect(
        borderRadius: borderRadius!,
        child: imageWidget,
      );
    }

    return imageWidget;
  }

  Widget _buildFallback() {
    return errorWidget ??
        Container(
          width: width,
          height: height,
          color: AppColors.primaryTeal.withValues(alpha: 0.1),
          child: const Center(
            child: Icon(
              Icons.image_outlined,
              color: AppColors.primaryTeal,
              size: 24,
            ),
          ),
        );
  }
}
