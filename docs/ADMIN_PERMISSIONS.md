# DentaCollab Admin Permissions & Authorization Matrix

## 1. Role Definitions

Roles are assigned via Firebase Authentication Custom Claims (`request.auth.token.role`) and mirrored in Firestore `staffMemberships/{uid}`.

| Role | Scope | Permitted Actions |
|---|---|---|
| `super_admin` | Global Platform | Manage team roles, system settings, bootstrap scripts, view audit logs, issue certificates. |
| `academy_manager` | Operations | Create/edit course cohorts, review enrollments, manage capacity, publish notification campaigns. |
| `content_editor` | CMS | Edit course descriptions, curriculum modules, workshops, gallery media, FAQs. |
| `instructor` | Teaching | View roster of assigned cohorts, record and verify student attendance passes. |
| `support_agent` | Support | Respond to student inquiries, view ticket histories. |
| `student` | Trainee | Manage own profile, enroll in cohorts, view My Learning pass, mark inbox notifications read. |

---

## 2. Enforcement Layers

1. **Firestore Security Rules:** Hard deny-all default. Client mutations to privileged fields (status, capacity, payments, roles) are strictly rejected.
2. **Cloud Functions:** Server-side verification of caller identity and custom claims.
3. **Admin Web Navigation:** Route guards check the active user's custom claim before rendering sensitive panels.
