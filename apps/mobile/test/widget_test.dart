import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dentacollab/main.dart';

void main() {
  testWidgets('DentaCollab app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: DentaCollabApp(),
      ),
    );

    // Verify brand name appears
    expect(find.text('DentaCollab'), findsOneWidget);
  });
}
