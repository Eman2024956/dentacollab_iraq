import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../../firebase_options.dart';
import '../data/academy_repository.dart';
import '../models/app_models.dart';

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  if (kDebugMode) {
    print('Handling background message: ${message.messageId}');
  }
}

class NotificationService {
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  static final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();
  static bool _localNotificationsReady = false;

  static const String highImportanceChannelId = 'all_customers';
  static const String highImportanceChannelName = 'إشعارات دنتكولاب الهامة';
  static const String highImportanceChannelDesc =
      'قناة إشعارات الدورات والتنبيهات المباشرة مع التنبيه الصوتي والبانر المنبثق';

  static const AndroidNotificationChannel _androidChannel =
      AndroidNotificationChannel(
    highImportanceChannelId,
    highImportanceChannelName,
    description: highImportanceChannelDesc,
    importance: Importance.max, // Enables Heads-up pop banner
    playSound: true,
    enableVibration: true,
    showBadge: true,
  );

  static const AndroidNotificationChannel _customChannel =
      AndroidNotificationChannel(
    'dentacollab_high_importance_channel',
    'إشعارات الدورات والتنبيهات',
    description: 'قناة التنبيهات المباشرة',
    importance: Importance.max,
    playSound: true,
    enableVibration: true,
    showBadge: true,
  );

  static Future<void> initialize() async {
    // 1. Initialize Firebase Core
    try {
      await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform,
      );
    } catch (e) {
      if (kDebugMode) {
        print('Firebase.initializeApp error: $e');
      }
    }

    // 2. Register background handler for FCM
    try {
      FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);
    } catch (e) {
      if (kDebugMode) {
        print('onBackgroundMessage registration error: $e');
      }
    }

    // 3. Request Firebase Messaging permissions (iOS & Android 13+)
    try {
      final settings = await _messaging.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );

      if (kDebugMode) {
        print('User notification permission status: ${settings.authorizationStatus}');
      }
    } catch (e) {
      if (kDebugMode) {
        print('requestPermission error: $e');
      }
    }

    // 4. Set iOS foreground presentation options so pop banner and sound work while app is open
    try {
      await _messaging.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );
    } catch (e) {
      if (kDebugMode) {
        print('setForegroundNotificationPresentationOptions error: $e');
      }
    }

    // 5. Initialize Flutter Local Notifications for Android heads-up pop banner
    try {
      const initializationSettingsAndroid =
          AndroidInitializationSettings('@mipmap/ic_launcher');

      const initializationSettingsDarwin = DarwinInitializationSettings(
        requestAlertPermission: true,
        requestBadgePermission: true,
        requestSoundPermission: true,
      );

      const initializationSettings = InitializationSettings(
        android: initializationSettingsAndroid,
        iOS: initializationSettingsDarwin,
      );

      await _localNotifications.initialize(
        settings: initializationSettings,
        onDidReceiveNotificationResponse: (NotificationResponse response) {
          if (kDebugMode) {
            print('Notification clicked: ${response.payload}');
          }
        },
      );

      // Create Android Notification Channels (API 26+)
      if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
        final androidImplementation = _localNotifications
            .resolvePlatformSpecificImplementation<
                AndroidFlutterLocalNotificationsPlugin>();

        if (androidImplementation != null) {
          await androidImplementation.createNotificationChannel(_androidChannel);
          await androidImplementation.createNotificationChannel(_customChannel);
          await androidImplementation.requestNotificationsPermission();
        }
      }

      _localNotificationsReady = true;
      if (kDebugMode) {
        print('LocalNotificationsPlugin initialized successfully with Pop Banner channel');
      }
    } catch (localNotifError) {
      _localNotificationsReady = false;
      if (kDebugMode) {
        print(
          'LocalNotificationsPlugin requires a full app rebuild (stop flutter run & rebuild): $localNotifError',
        );
      }
    }

    // 6. Auto-subscribe to customer broadcast topics
    try {
      await _messaging.subscribeToTopic('all_customers');
      await _messaging.subscribeToTopic('academy_updates');
      if (kDebugMode) {
        print('Subscribed to topics: all_customers, academy_updates');
      }
    } catch (topicError) {
      if (kDebugMode) {
        print('Topic subscription skipped: $topicError');
      }
    }

    // 7. Get FCM token
    try {
      final token = await _messaging.getToken();
      if (kDebugMode) {
        print('FCM Registration Token: $token');
      }
    } catch (tokenError) {
      if (kDebugMode) {
        print('FCM token skipped: $tokenError');
      }
    }

    // 8. Listen to foreground messages and show pop banner
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      if (kDebugMode) {
        print('Got foreground message: ${message.notification?.title}');
      }

      final title = message.notification?.title ??
          message.data['titleAr'] ??
          'تنبيه جديد من الأكاديمية';
      final body = message.notification?.body ??
          message.data['bodyAr'] ??
          '';

      // Add to durable in-app notifications
      AcademyRepository.notifications.insert(
        0,
        NotificationItemModel(
          id: message.messageId ?? 'msg_${DateTime.now().millisecondsSinceEpoch}',
          title: title,
          body: body,
          time: 'الآن',
          read: false,
        ),
      );

      // On Android, show local notification pop banner if foreground and plugin ready
      if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android && _localNotificationsReady) {
        showLocalNotification(
          id: message.hashCode,
          title: title,
          body: body,
          payload: message.data.isNotEmpty ? message.data.toString() : null,
        );
      }
    });

    // 9. Handle notification opened app
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      if (kDebugMode) {
        print('Notification caused app to open: ${message.data}');
      }
    });
  }

  /// Show a pop banner notification with default sound on device/emulator
  static Future<void> showLocalNotification({
    int? id,
    required String title,
    required String body,
    String? payload,
  }) async {
    if (!_localNotificationsReady) {
      if (kDebugMode) {
        print('LocalNotificationsPlugin not yet ready (needs fresh flutter run)');
      }
      return;
    }

    try {
      final notifId = id ?? DateTime.now().millisecondsSinceEpoch.remainder(100000);
      const androidDetails = AndroidNotificationDetails(
        highImportanceChannelId,
        highImportanceChannelName,
        channelDescription: highImportanceChannelDesc,
        importance: Importance.max,
        priority: Priority.high,
        playSound: true,
        enableVibration: true,
        icon: '@mipmap/ic_launcher',
        styleInformation: BigTextStyleInformation(''),
      );

      const darwinDetails = DarwinNotificationDetails(
        presentAlert: true,
        presentBadge: true,
        presentSound: true,
      );

      const notificationDetails = NotificationDetails(
        android: androidDetails,
        iOS: darwinDetails,
      );

      await _localNotifications.show(
        id: notifId,
        title: title,
        body: body,
        notificationDetails: notificationDetails,
        payload: payload,
      );
    } catch (e) {
      if (kDebugMode) {
        print('Error showing local notification: $e');
      }
    }
  }

  /// Trigger a live test notification to verify channel sound and pop banner
  static Future<void> sendTestNotification() async {
    final title = '🔔 تجربة إشعار الأكاديمية';
    final body = 'تم تفعيل التنبيهات بنجاح بصوت الإشعار والبانر المنبثق على جهازك.';

    // Insert into notifications list
    AcademyRepository.notifications.insert(
      0,
      NotificationItemModel(
        id: 'test_${DateTime.now().millisecondsSinceEpoch}',
        title: title,
        body: body,
        time: 'الآن',
        read: false,
      ),
    );

    if (_localNotificationsReady) {
      await showLocalNotification(
        title: title,
        body: body,
      );
    }
  }

  static Future<String?> getToken() async {
    try {
      return await _messaging.getToken();
    } catch (_) {
      return null;
    }
  }
}
