# Public route inventory

All routes below were present in the public application's routing table on 1 October 2026. Their backend records are not part of this delivery.

| Route               | Page/design                                                                                       | Local preview example                    |
| ------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `/`                 | Home, hero, model viewer, workflow, specialties, programs, benefits, instructor, reservation, FAQ | `/`                                      |
| `/about`            | Academy story, mission, vision, values, team, CTA                                                 | `/about`                                 |
| `/courses`          | Course cards and empty state                                                                      | `/courses`                               |
| `/courses/:slug`    | Hero, facts, curriculum, trainers, equipment, registration, FAQ                                   | `/courses/digital-dentistry-foundations` |
| `/workshops`        | Horizontal workshop cards and empty state                                                         | `/workshops`                             |
| `/workshops/:slug`  | Schedule, presenter, venue, image, description                                                    | `/workshops/digital-workflow-workshop`   |
| `/instructors`      | Instructor cards and empty state                                                                  | `/instructors`                           |
| `/instructors/:id`  | Profile, biography, credentials, summary, courses                                                 | `/instructors/sample-instructor`         |
| `/benefits`         | Student benefits                                                                                  | `/benefits`                              |
| `/gallery`          | Categorized gallery, filters, lightbox                                                            | `/gallery`                               |
| `/graduates`        | Graduate/review cards and empty state                                                             | `/graduates`                             |
| `/testimonials`     | Redirect to graduates                                                                             | `/testimonials`                          |
| `/faq`              | Categorized questions, search and accordions                                                      | `/faq`                                   |
| `/chat`             | Full-page assistant UI                                                                            | `/chat`                                  |
| `/contact`          | Contact channels, form, location, map                                                             | `/contact`                               |
| `/payments/success` | Unverified state or explicit success design preview                                               | `/payments/success?demo=1`               |
| `/payments/failed`  | Unverified state or explicit failure design preview                                               | `/payments/failed?demo=1`                |
| `/payments/cancel`  | Unverified state or explicit cancellation design preview                                          | `/payments/cancel?demo=1`                |
| Other routes        | Custom 404 (added for completeness)                                                               | `/missing-page`                          |

## Shared behavior

- Header and footer on all routes.
- Floating assistant except on `/chat`.
- Arabic is the default. The language switch also changes document direction.
- Theme and language are stored as device-local preferences only.
- Same-origin navigation uses the History API. Browser back/forward and direct links are supported.
- Course registration is addressable with `#registration`; curriculum with `#curriculum`.

## Sample records

Course slugs: `digital-dentistry-foundations`, `implant-planning`, `dental-3d-printing`.
Instructor ID: `sample-instructor`.
Workshop slug: `digital-workflow-workshop`.

Unknown detail IDs show an unavailable page. No original private course IDs or student records were retrieved.
