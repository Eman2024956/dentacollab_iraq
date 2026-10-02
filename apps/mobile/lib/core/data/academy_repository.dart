import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import '../models/app_models.dart';

class AcademyRepository {
  // Named Firestore instance pointing to 'dentacollab' database
  static FirebaseFirestore get _firestore {
    try {
      return FirebaseFirestore.instanceFor(
        app: Firebase.app(),
        databaseId: 'dentacollab',
      );
    } catch (_) {
      return FirebaseFirestore.instance;
    }
  }

  // ===================== INSTRUCTORS =====================
  static Stream<List<InstructorModel>> streamInstructors() {
    return _firestore
        .collection('instructors')
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) {
        return const <InstructorModel>[];
      }
      return snapshot.docs
          .map((doc) => InstructorModel.fromMap(doc.id, doc.data()))
          .toList()
        ..sort((a, b) => a.order.compareTo(b.order));
    }).handleError((_) => const <InstructorModel>[]);
  }

  static Future<List<InstructorModel>> getInstructors() async {
    try {
      final snap = await _firestore.collection('instructors').get();
      if (snap.docs.isEmpty) return const [];
      return snap.docs
          .map((doc) => InstructorModel.fromMap(doc.id, doc.data()))
          .toList()
        ..sort((a, b) => a.order.compareTo(b.order));
    } catch (_) {
      return const [];
    }
  }

  // ===================== COURSES =====================
  static Stream<List<CourseModel>> streamCourses() {
    return _firestore
        .collection('courses')
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) {
        return const <CourseModel>[];
      }
      return snapshot.docs
          .map((doc) => CourseModel.fromMap(doc.id, doc.data()))
          .where((course) => course.isPublished)
          .toList();
    }).handleError((_) => const <CourseModel>[]);
  }

  // ===================== WORKSHOPS =====================
  static Stream<List<WorkshopModel>> streamWorkshops() {
    return _firestore
        .collection('workshops')
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) {
        return const <WorkshopModel>[];
      }
      return snapshot.docs
          .map((doc) => WorkshopModel.fromMap(doc.id, doc.data()))
          .where((workshop) => workshop.isPublished)
          .toList();
    }).handleError((_) => const <WorkshopModel>[]);
  }

  // ===================== SERVICES =====================
  static Stream<List<ServiceItemModel>> streamServices() {
    return _firestore
        .collection('services')
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) {
        return const <ServiceItemModel>[];
      }
      return snapshot.docs
          .map((doc) => ServiceItemModel.fromMap(doc.id, doc.data()))
          .toList();
    }).handleError((_) => const <ServiceItemModel>[]);
  }

  // ===================== GRADUATES =====================
  static Stream<List<GraduateModel>> streamGraduates() {
    return _firestore
        .collection('graduates')
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) {
        return const <GraduateModel>[];
      }
      return snapshot.docs
          .map((doc) => GraduateModel.fromMap(doc.id, doc.data()))
          .toList()
        ..sort((a, b) => b.rating.compareTo(a.rating));
    }).handleError((_) => const <GraduateModel>[]);
  }

  static Future<List<GraduateModel>> getGraduates() async {
    try {
      final snap = await _firestore.collection('graduates').get();
      if (snap.docs.isEmpty) return const [];
      return snap.docs
          .map((doc) => GraduateModel.fromMap(doc.id, doc.data()))
          .toList()
        ..sort((a, b) => b.rating.compareTo(a.rating));
    } catch (_) {
      return const [];
    }
  }

  // ===================== HERO SLIDER BANNER =====================
  static Stream<HeroBannerSettingsModel> streamHeroBannerSettings() {
    // Attempt named database first, with fallback to default database instance
    Stream<DocumentSnapshot<Map<String, dynamic>>> primaryStream;
    try {
      primaryStream = _firestore
          .collection('appSettings')
          .doc('heroBanner')
          .snapshots();
    } catch (_) {
      primaryStream = FirebaseFirestore.instance
          .collection('appSettings')
          .doc('heroBanner')
          .snapshots();
    }

    return primaryStream.map((docSnap) {
      if (!docSnap.exists || docSnap.data() == null) {
        debugPrint('ℹ️ [HeroBanner] Document appSettings/heroBanner not found or empty, using fallback');
        return HeroBannerSettingsModel.fallback();
      }
      final data = docSnap.data()!;
      final parsed = HeroBannerSettingsModel.fromMap(data);
      return parsed;
    }).handleError((err) {
      debugPrint('🚨 [HeroBanner Stream Error]: $err');
      return HeroBannerSettingsModel.fallback();
    });
  }

  // ===================== GALLERY =====================
  static Stream<List<GalleryAlbumModel>> streamGallery() {
    Stream<QuerySnapshot<Map<String, dynamic>>> primaryStream;
    try {
      primaryStream = _firestore.collection('gallery').snapshots();
    } catch (_) {
      primaryStream = FirebaseFirestore.instance.collection('gallery').snapshots();
    }

    return primaryStream.map((snapshot) {
      if (snapshot.docs.isEmpty) {
        return const <GalleryAlbumModel>[];
      }
      return snapshot.docs
          .map((doc) => GalleryAlbumModel.fromMap(doc.id, doc.data()))
          .where((a) => a.status == 'published')
          .toList()
        ..sort((a, b) => a.order.compareTo(b.order));
    }).handleError((err) {
      debugPrint('🚨 [Gallery Stream Error]: $err');
      return const <GalleryAlbumModel>[];
    });
  }

  static Future<List<GalleryAlbumModel>> getGallery() async {
    try {
      final snap = await _firestore.collection('gallery').get();
      if (snap.docs.isEmpty) return const [];
      return snap.docs
          .map((doc) => GalleryAlbumModel.fromMap(doc.id, doc.data()))
          .where((a) => a.status == 'published')
          .toList()
        ..sort((a, b) => a.order.compareTo(b.order));
    } catch (_) {
      return const [];
    }
  }

  // ===================== USER PROFILE & ACCOUNT =====================
  static Stream<UserProfileModel> streamUserProfile(String uid) {
    if (uid.isEmpty) {
      return Stream.value(const UserProfileModel());
    }
    return _firestore.collection('users').doc(uid).snapshots().map((docSnap) {
      if (!docSnap.exists || docSnap.data() == null) {
        return const UserProfileModel();
      }
      return UserProfileModel.fromMap(docSnap.data()!);
    }).handleError((_) => const UserProfileModel());
  }

  static Future<void> saveUserProfile(String uid, UserProfileModel profile) async {
    if (uid.isEmpty) return;
    try {
      await _firestore.collection('users').doc(uid).set(
        profile.toMap(),
        SetOptions(merge: true),
      );
    } catch (e) {
      debugPrint('Error saving user profile: $e');
    }
  }

  static Stream<List<UserCertificateModel>> streamCertificates(String uid) {
    if (uid.isEmpty) return Stream.value(const <UserCertificateModel>[]);
    return _firestore
        .collection('users')
        .doc(uid)
        .collection('certificates')
        .snapshots()
        .map((snap) {
      if (snap.docs.isEmpty) return const <UserCertificateModel>[];
      return snap.docs
          .map((d) => UserCertificateModel.fromMap(d.id, d.data()))
          .toList();
    }).handleError((_) => const <UserCertificateModel>[]);
  }

  static Stream<List<UserServiceRequestModel>> streamServiceRequests(String uid) {
    if (uid.isEmpty) return Stream.value(const <UserServiceRequestModel>[]);
    return _firestore
        .collection('users')
        .doc(uid)
        .collection('serviceRequests')
        .snapshots()
        .map((snap) {
      if (snap.docs.isEmpty) return const <UserServiceRequestModel>[];
      return snap.docs
          .map((d) => UserServiceRequestModel.fromMap(d.id, d.data()))
          .toList();
    }).handleError((_) => const <UserServiceRequestModel>[]);
  }

  static Stream<List<UserPaymentReceiptModel>> streamPayments(String uid) {
    if (uid.isEmpty) return Stream.value(const <UserPaymentReceiptModel>[]);
    return _firestore
        .collection('users')
        .doc(uid)
        .collection('payments')
        .snapshots()
        .map((snap) {
      if (snap.docs.isEmpty) return const <UserPaymentReceiptModel>[];
      return snap.docs
          .map((d) => UserPaymentReceiptModel.fromMap(d.id, d.data()))
          .toList();
    }).handleError((_) => const <UserPaymentReceiptModel>[]);
  }

  static Future<void> toggleSavedCourse(String uid, String courseId) async {
    if (uid.isEmpty) return;
    try {
      final docRef = _firestore.collection('users').doc(uid);
      final doc = await docRef.get();
      List<dynamic> current = [];
      if (doc.exists && doc.data() != null && doc.data()!['savedCourseIds'] is List) {
        current = List.from(doc.data()!['savedCourseIds'] as List);
      }
      if (current.contains(courseId)) {
        current.remove(courseId);
      } else {
        current.add(courseId);
      }
      await docRef.set({'savedCourseIds': current}, SetOptions(merge: true));
    } catch (e) {
      debugPrint('Error toggling saved course: $e');
    }
  }

  // Empty lists — real data comes from Firestore. No mock data.
  static final List<UserCertificateModel> fallbackCertificates = [];
  static final List<UserServiceRequestModel> fallbackServiceRequests = [];
  static final List<UserPaymentReceiptModel> fallbackPaymentReceipts = [];

  // ===================== NOTIFICATIONS =====================
  static final Set<String> _dismissedNotificationIds = <String>{};
  // Mutable runtime list for FCM foreground push notifications (empty by default)
  static List<NotificationItemModel> notifications = [];

  static Stream<List<NotificationItemModel>> streamNotifications() {
    return _firestore
        .collection('publicNotifications')
        .snapshots()
        .map((snapshot) {
      final firestoreItems = snapshot.docs.map((doc) {
        final data = doc.data();

        // Extract title (handles both Map {ar, en} from Admin and plain String)
        String title = '';
        if (data['title'] is Map) {
          title = data['title']['ar']?.toString() ??
              data['title']['en']?.toString() ??
              '';
        } else {
          title = data['title']?.toString() ?? '';
        }
        if (title.isEmpty) title = 'تنبيه جديد';

        // Extract body (handles both Map {ar, en} from Admin and plain String)
        String body = '';
        if (data['body'] is Map) {
          body = data['body']['ar']?.toString() ??
              data['body']['en']?.toString() ??
              '';
        } else {
          body = data['body']?.toString() ?? '';
        }

        // Extract time
        String time = 'الآن';
        if (data['sentAt'] != null) {
          final sentStr = data['sentAt'].toString();
          time = sentStr.length >= 16
              ? sentStr.substring(0, 16).replaceAll('T', ' ')
              : sentStr;
        } else if (data['createdAt'] != null) {
          final createdStr = data['createdAt'].toString();
          time = createdStr.length >= 16
              ? createdStr.substring(0, 16).replaceAll('T', ' ')
              : createdStr;
        }

        return NotificationItemModel(
          id: doc.id,
          title: title,
          body: body,
          time: time,
          read: data['read'] == true,
        );
      }).where((item) => !_dismissedNotificationIds.contains(item.id)).toList();

      // Merge any runtime foreground notifications received via FCM
      final result = <NotificationItemModel>[...firestoreItems];
      for (final n in notifications) {
        if (!_dismissedNotificationIds.contains(n.id) &&
            !result.any((item) => item.id == n.id)) {
          result.insert(0, n);
        }
      }

      return result;
    }).handleError((_) => notifications.where((n) => !_dismissedNotificationIds.contains(n.id)).toList());
  }

  static Future<void> deleteNotification(String id) async {
    _dismissedNotificationIds.add(id);
    notifications.removeWhere((item) => item.id == id);
    if (!id.startsWith('test_')) {
      try {
        await _firestore.collection('publicNotifications').doc(id).delete();
      } catch (_) {}
      await _callBackendDelete(id);
    }
  }

  static void restoreNotification(int index, NotificationItemModel item) {
    _dismissedNotificationIds.remove(item.id);
    if (index >= 0 && index <= notifications.length) {
      notifications.insert(index, item);
    } else {
      notifications.add(item);
    }
  }

  static Future<void> clearAllNotifications() async {
    // 1. Mark all known and Firestore notifications as dismissed locally
    try {
      final snapshot = await _firestore.collection('publicNotifications').get();
      final batch = _firestore.batch();
      for (final doc in snapshot.docs) {
        _dismissedNotificationIds.add(doc.id);
        batch.delete(doc.reference);
      }
      await batch.commit();
    } catch (_) {}

    for (final n in notifications) {
      _dismissedNotificationIds.add(n.id);
    }
    notifications.clear();

    // 2. Call backend Admin API to permanently delete all from Firestore
    await _callBackendClearAll();
  }

  static Future<void> _callBackendDelete(String id) async {
    if (kIsWeb) return;
    final host = defaultTargetPlatform == TargetPlatform.android ? '10.0.2.2' : 'localhost';
    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 3);
      final request = await client.postUrl(Uri.parse('http://$host:3001/api/notifications/delete'));
      request.headers.set('Content-Type', 'application/json');
      request.write(jsonEncode({'id': id}));
      final response = await request.close();
      await response.drain();
      client.close();
    } catch (_) {}
  }

  static Future<void> _callBackendClearAll() async {
    if (kIsWeb) return;
    final host = defaultTargetPlatform == TargetPlatform.android ? '10.0.2.2' : 'localhost';
    try {
      final client = HttpClient();
      client.connectionTimeout = const Duration(seconds: 4);
      final request = await client.postUrl(Uri.parse('http://$host:3001/api/notifications/clear'));
      request.headers.set('Content-Type', 'application/json');
      final response = await request.close();
      await response.drain();
      client.close();
    } catch (_) {}
  }

  static void markNotificationAsRead(String id) {
    final index = notifications.indexWhere((n) => n.id == id);
    if (index != -1) {
      final old = notifications[index];
      notifications[index] = NotificationItemModel(
        id: old.id,
        title: old.title,
        body: old.body,
        time: old.time,
        read: true,
      );
    }
  }

  // ===================== RUNTIME STATE =====================
  // These lists are mutated at runtime (no pre-seeded mock data).
  static final List<InstructorModel> fallbackInstructors = [];
  static final List<WorkshopModel> fallbackWorkshops = [];
  static final List<ServiceItemModel> fallbackServices = [];
  static final List<GraduateModel> fallbackGraduates = [];
  static final List<GalleryAlbumModel> fallbackGallery = [];
  static final List<CourseModel> courses = [];
  static final List<EnrollmentModel> myEnrollments = [];
}
extension StringSliceSafe on String {
  String sliceSafe(int start, [int? end]) {
    if (length <= start) return this;
    if (end != null && length < end) return substring(start);
    return substring(start, end);
  }
}
