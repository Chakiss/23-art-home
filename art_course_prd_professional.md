# PRD: QR-Based Art Course Ordering System

**Document Version:** 1.0  
**Status:** Draft for Development  
**Prepared For:** Product / Design / Engineering / Operations  
**Prepared Date:** 2026-03-28  
**Platform:** Mobile Web (Responsive)  
**Entry Point:** QR Code

---

## 1. Overview

### 1.1 Product Name
QR-Based Art Course Ordering System

### 1.2 Product Summary
This product enables parents to scan a QR code and select art courses for children through a mobile-first ordering experience similar to food ordering.

Users can:
- browse course categories
- build a custom 5-session course
- select predefined course packages
- add an art supply bag
- review a cart
- submit registration details

The system is intended to simplify course selection, improve sales conversion, reduce manual explanation effort, and standardize order capture.

### 1.3 Problem Statement
The current course-selling process is often manual and inconsistent:
- customers may not clearly understand available course options
- pricing may be difficult to summarize quickly
- staff must repeatedly explain course structures
- no standard self-service flow exists for course selection
- upsell opportunities are missed

This system addresses those issues with a guided, self-service ordering flow.

---

## 2. Goals

### 2.1 Business Goals
- increase conversion from walk-in / QR scan to registration
- reduce staff effort in explaining course options
- make pricing transparent and easy to understand
- increase upsell of art supply products
- standardize the registration and order capture process

### 2.2 User Goals
- quickly understand available course types
- select courses without staff assistance
- see clear total pricing before submission
- complete registration easily on mobile

---

## 3. Scope

### 3.1 In Scope (MVP)
- QR code entry to landing page
- category-based course browsing
- custom course builder with exactly 5 sessions
- predefined course selection
- add-on art supply product selection
- cart management
- automatic total price calculation
- parent/student information form
- order / registration submission
- success confirmation screen

### 3.2 Out of Scope (MVP)
- online payment gateway
- scheduling and calendar booking
- user login / account system
- membership / loyalty points
- advanced admin portal
- automated refund / cancellation workflow
- multi-branch scheduling logic

---

## 4. Target Users

### 4.1 Primary User
**Parent / Guardian**
- scans QR code
- selects course(s)
- submits student information
- places registration request

### 4.2 Secondary User
**Admin / Staff**
- receives submitted registration
- contacts parent
- confirms enrollment manually
- tracks submitted orders

---

## 5. Product Structure

The system consists of 3 major product groups:

1. **Custom Main Course**
2. **Predefined Course Packages**
3. **Art Supply Add-on**

---

## 6. Product Catalog

## 6.1 Custom Main Course

### Category Name
**คอร์สหลัก – จัดเองได้**

### Description
Parents can build a custom course by selecting individual lesson items. A valid course must contain exactly **5 sessions**.

### Course Rules
- 1 course = 5 sessions
- 1 session = 2 hours
- target age = 4–12 years old
- final course price = sum of selected items
- users may select repeated items
- users cannot confirm a custom course with fewer or more than 5 sessions

### Selectable Lesson Items
| Item | Price (THB) |
|---|---:|
| วาดเส้นสร้างสรรค์ | 460 |
| วาดการ์ตูน / นิเทศศิลป์ | 460 |
| Story Board | 460 |
| ประดิษฐ์ DIY | 500 |
| สนุกกับการใช้สีและเทคนิคต่างๆ | 460 |
| ปั้น | 490 |

---

## 6.2 Predefined Course Packages

### Category Name
**คอร์สสำเร็จรูป**

### Description
These are ready-made courses predefined by the business and can be added directly to the cart.

| Course | Price (THB) |
|---|---:|
| คอร์สสีน้ำ | 2,300 |
| คอร์สสีอะคริลิก | 2,300 |
| คอร์สปั้น 3 มิติ | 2,500 |
| คอร์สประดิษฐ์ DIY | 3,000 |
| Digital Art | 2,300 |
| Combo Set (วาดเส้น, สี, คาแรคเตอร์, ออกแบบ, จัดองค์ประกอบ) | 2,300 |
| Story Board | 2,300 |
| ศิลปะผ้าสร้างสรรค์ | 2,500 |

---

## 6.3 Art Supply Add-on

### Category Name
**อุปกรณ์เพิ่มเติม**

| Item | Price (THB) |
|---|---:|
| กระเป๋าศิลปะและอุปกรณ์พร้อมใช้ | 800 |

### Rule
- can be purchased with or without a course
- treated as a standard sellable item

---

## 7. User Experience Principles

The UX should feel similar to a simple food ordering flow:
- scan QR
- browse category
- add item(s)
- review cart
- submit details
- receive confirmation

### UX Priorities
- mobile-first
- visually simple
- easy to understand
- low friction
- transparent pricing
- minimal number of steps

---

## 8. End-to-End User Flow

1. User scans QR code
2. User lands on mobile landing page
3. User browses categories
4. User either:
   - builds a custom 5-session course, or
   - adds predefined course(s), or
   - adds art supply item(s)
5. User opens cart
6. User reviews order summary
7. User fills parent and student details
8. User submits registration
9. System stores order
10. System shows success page with reference number

---

## 9. Detailed Functional Requirements

## 9.1 Landing Page

### Purpose
Serve as the first page after QR scan and provide entry to main catalog sections.

### Functional Requirements
- display business / school name
- display short introduction text
- display 3 primary categories:
  - custom main course
  - predefined courses
  - add-on supplies
- display visible cart icon/button
- show cart item count if cart is not empty

### Acceptance Criteria
- user can access landing page directly from QR code
- landing page loads correctly on mobile
- all main categories are clearly visible
- user can navigate to each category page
- cart button is always accessible

---

## 9.2 Course Listing Page

### Purpose
Display available items under each category.

### Functional Requirements
Each course card should show:
- title
- short description
- price
- age range where relevant
- duration where relevant
- action button

### Acceptance Criteria
- user can view all items under the selected category
- each item displays correct price
- user can add eligible items to cart or open detail flow
- categories are clearly separated

---

## 9.3 Custom Course Builder

### Purpose
Allow user to construct exactly one 5-session custom course.

### Functional Requirements
- show explanation: 1 course = 5 sessions
- show all selectable lesson items
- allow increment / decrement selection
- allow repeated lesson selection
- show current count, e.g. `3/5`
- show dynamic total price
- disable confirmation until total selected sessions = 5
- prevent adding more than 5 sessions
- once user confirms, create one custom course bundle and add it to cart

### Business Rules
- maximum selection per custom course bundle = 5 sessions
- minimum selection to confirm = 5 sessions
- repeated item selection is allowed
- total price = sum(unit price of selected sessions)
- custom course bundle is stored as one grouped cart item with item-level breakdown

### Acceptance Criteria
- total count updates immediately after each add/remove action
- total price updates immediately after each add/remove action
- confirm button stays disabled until exactly 5 sessions are selected
- user cannot add session #6
- confirmed bundle appears in cart with lesson breakdown

---

## 9.4 Predefined Course Selection

### Purpose
Allow users to directly add ready-made course packages to cart.

### Functional Requirements
- show course list
- each course has a fixed price
- user can add one or more predefined courses to cart
- quantity behavior should be configurable:
  - default recommendation: quantity = 1 per click, editable in cart

### Acceptance Criteria
- user can add predefined course to cart
- cart total updates correctly
- item remains visible in cart until removed

---

## 9.5 Add-on Item Selection

### Purpose
Allow users to add art supplies as upsell item(s).

### Functional Requirements
- show add-on item card
- allow add to cart
- allow quantity adjustment in cart

### Acceptance Criteria
- user can add art supply item to cart
- price is included in total amount
- user can remove the item from cart

---

## 9.6 Cart

### Purpose
Provide a consolidated view of all selected items before submission.

### Functional Requirements
- show all selected items
- show product type:
  - custom course bundle
  - predefined course
  - add-on supply
- show quantity where applicable
- show line total
- show subtotal / total amount
- allow item removal
- allow back navigation to continue shopping
- allow proceed to checkout

### Acceptance Criteria
- removing an item updates total immediately
- custom course bundle displays selected 5-session breakdown
- predefined courses show correct fixed price
- add-on items show correct price and quantity
- proceed button is available when cart is not empty

---

## 9.7 Checkout Form

### Purpose
Collect customer and student information required for follow-up and manual confirmation.

### Required Fields
#### Parent Information
- parent full name
- phone number

#### Optional Parent Information
- LINE ID
- additional contact note

#### Student Information
- student name
- student age

#### Optional
- note / special request

### Order Information Captured Automatically
- selected items
- total amount
- timestamp
- system reference number

### Validation Rules
- parent full name is required
- phone number is required
- student name is required
- student age is required
- cart must not be empty
- phone number format should be validated at minimum basic level

### Acceptance Criteria
- incomplete form cannot be submitted
- validation errors are shown clearly
- successful submission stores all order data
- success screen appears after successful submission

---

## 9.8 Success Page

### Purpose
Confirm that the order/registration request was submitted successfully.

### Functional Requirements
- show success message
- show reference number
- show brief order summary
- show total amount
- show next-step message, e.g. staff will contact parent

### Acceptance Criteria
- success page is displayed only after valid submission
- reference number is visible
- summary matches submitted order

---

## 10. Business Rules

## 10.1 General Rules
- all displayed prices are in THB
- total amount must always equal sum of selected items
- cart may contain mixed item types

## 10.2 Custom Course Rules
- exactly 5 sessions required per custom course bundle
- price is dynamic based on selected lessons
- repeated lesson items are allowed
- bundle cannot be added to cart until valid
- user cannot exceed 5 sessions within a single custom bundle

## 10.3 Predefined Course Rules
- fixed price per course
- selectable independently
- can coexist with custom course in same cart

## 10.4 Add-on Rules
- can be purchased with or without course
- quantity can be 1 or more if business allows
- default recommendation: allow quantity edit in cart

## 10.5 Submission Rules
- order submission requires at least 1 cart item
- required customer fields must be completed
- successful submission creates one order record with one reference number

---

## 11. Data Model (Recommended)

## 11.1 Product
```json
{
  "product_id": "string",
  "product_name": "string",
  "product_type": "custom_course_item | predefined_course | accessory",
  "category_name": "string",
  "description": "string",
  "price": 0,
  "duration_hours": 0,
  "age_min": 0,
  "age_max": 0,
  "is_active": true,
  "display_order": 0
}
```

## 11.2 Custom Course Bundle
```json
{
  "bundle_id": "string",
  "session_count": 5,
  "selected_items": [
    {
      "product_id": "string",
      "product_name": "string",
      "unit_price": 460,
      "quantity": 1,
      "line_total": 460
    }
  ],
  "bundle_total": 2370,
  "created_at": "timestamp"
}
```

## 11.3 Cart
```json
{
  "cart_id": "string",
  "session_id": "string",
  "items": [
    {
      "cart_item_id": "string",
      "item_type": "custom_bundle | predefined_course | accessory",
      "ref_id": "string",
      "name": "string",
      "quantity": 1,
      "unit_price": 2300,
      "line_total": 2300,
      "bundle_detail": {}
    }
  ],
  "total_amount": 0,
  "updated_at": "timestamp"
}
```

## 11.4 Order / Registration
```json
{
  "order_id": "string",
  "reference_no": "string",
  "parent_name": "string",
  "parent_phone": "string",
  "parent_line_id": "string",
  "student_name": "string",
  "student_age": 0,
  "note": "string",
  "items": [],
  "total_amount": 0,
  "status": "submitted | contacted | confirmed | cancelled",
  "created_at": "timestamp"
}
```

---

## 12. API Considerations (Recommended)

This section is intentionally lightweight and can be adapted to Firebase, Supabase, or custom backend.

## 12.1 Suggested Endpoints

### GET /catalog
Returns all active products grouped by category.

### POST /cart/custom-bundle
Creates a custom course bundle from exactly 5 selected sessions.

### GET /cart
Returns active cart by session.

### POST /cart/items
Adds predefined course or accessory to cart.

### PATCH /cart/items/:id
Updates quantity or item details where allowed.

### DELETE /cart/items/:id
Removes cart item.

### POST /orders
Submits final order / registration.

### GET /orders/:referenceNo
Returns submission result if needed.

---

## 13. State Management Requirements

### Minimum Requirements
- cart must persist during active session
- user should not lose selections when navigating between pages
- session-based persistence is acceptable for MVP
- cart may be stored in:
  - local storage
  - database session document
  - temporary backend cart record

### Recommendation
For MVP, use session-based cart persistence with backend order submission.

---

## 14. Error Handling

### Expected Error Cases
- no internet / request timeout
- invalid cart state
- incomplete checkout form
- duplicate submit click
- server unavailable
- product inactive or changed before submit

### Required UX Messaging
- กรุณาเลือกให้ครบ 5 ครั้ง
- ไม่สามารถเพิ่มรายการเกิน 5 ครั้งได้
- กรุณากรอกข้อมูลให้ครบถ้วน
- เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง
- รายการบางส่วนมีการเปลี่ยนแปลง กรุณาตรวจสอบใหม่

### Technical Expectations
- backend must validate final submitted prices
- backend must not trust frontend totals blindly
- duplicate order creation should be minimized

---

## 15. Non-Functional Requirements

## 15.1 Performance
- mobile-first page load should be lightweight
- cart updates should feel immediate
- total recalculation should occur without visible delay

## 15.2 Usability
- buttons must be large enough for mobile tap targets
- navigation should be simple and shallow
- content should be readable without zooming

## 15.3 Compatibility
- latest mobile Safari
- latest Chrome on Android
- responsive support for tablet
- desktop support is secondary but functional

## 15.4 Security / Privacy
- basic input validation required on server side
- customer data must not be exposed publicly
- direct admin access should be restricted
- secure transport over HTTPS is required

---

## 16. Analytics Requirements

### Events to Track
- landing_view
- category_view
- product_view
- add_to_cart
- remove_from_cart
- custom_course_progress
- custom_course_completed
- checkout_start
- checkout_submit_success
- checkout_submit_fail

### Suggested Dimensions
- category
- product name
- cart value
- device type
- source QR campaign (if available)

### Purpose
- track funnel performance
- identify high-interest courses
- identify where users drop off
- measure upsell performance of art supply bag

---

## 17. Admin / Operations Requirements

For MVP, a full admin system is not required.

### Minimum Operational Requirement
Submitted orders should be accessible via one or more of the following:
- Google Sheet
- Email notification
- Admin dashboard list
- Messaging webhook / LINE notification

### Data Staff Must Receive
- order timestamp
- reference number
- parent name
- phone number
- student name
- student age
- selected items
- total amount
- note

---

## 18. Suggested Implementation Approach

### Recommended MVP Stack Options
#### Option A
- Frontend: Next.js / React responsive web
- Backend: Firebase / Firestore / Cloud Functions

#### Option B
- Frontend: Static/mobile web
- Backend: Supabase + edge functions

#### Option C
- Frontend: Lightweight web app
- Backend: Google Sheet + Apps Script for ultra-fast MVP

### Suggested Recommendation
If speed and simplicity are top priority:
- mobile web frontend
- backend with Firebase or Supabase
- store orders in database
- optional Google Sheet sync for operations visibility

---

## 19. Milestones

### Phase 1: MVP
- landing page
- category browsing
- custom course builder
- cart
- checkout form
- order submission
- confirmation page

### Phase 2
- admin dashboard
- order status update
- source tracking by QR code
- optional payment integration

### Phase 3
- schedule / class slot selection
- calendar integration
- parent self-service history
- promotions / coupon codes

---

## 20. Open Decisions for Product Team

The following items should be finalized before engineering build starts:

1. Whether predefined course quantity can exceed 1 in a single order
2. Whether art supply bag quantity can exceed 1
3. Whether the custom course builder should allow saving multiple custom bundles in one order
4. Whether staff follow-up is manual only or partially automated
5. Whether the checkout should collect preferred contact time
6. Whether QR source tracking is required from day one

---

## 21. Acceptance Criteria Summary

The MVP is considered successful when:

- user can scan QR and access the landing page
- user can browse all 3 product groups
- user can build a valid custom course of exactly 5 sessions
- system calculates custom course pricing correctly
- user can add predefined courses and accessories to the same cart
- cart total is always accurate
- user can submit parent/student details successfully
- system stores a complete order record
- success page displays reference number
- operations team can access submitted registration data

---

## 22. Sample UI Copy

### Landing
**เลือกคอร์สศิลปะให้เหมาะกับน้องได้ง่ายๆ**  
เลือกได้ทั้งแบบจัดคอร์สเอง หรือเลือกคอร์สสำเร็จรูป พร้อมอุปกรณ์ศิลปะครบชุด

### Custom Course Builder
**คอร์สเรียน 5 ครั้ง / ครั้งละ 2 ชั่วโมง / สำหรับเด็ก 4–12 ปี**  
เลือกวิชาให้ครบ 5 ครั้ง เพื่อสร้าง 1 คอร์ส

### Cart
**ตะกร้าคอร์สเรียนของคุณ**

### Checkout
**กรอกข้อมูลเพื่อส่งคำขอลงทะเบียน**

### Success
**ส่งข้อมูลเรียบร้อยแล้ว**  
ทางทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียดอีกครั้ง

---

## 23. Final Product Summary

This product is a mobile-first course ordering flow designed to simplify the sale of children's art classes through QR-based self-service selection.

The core differentiator is the **custom course builder**, where a parent selects exactly 5 lessons to form one course, with dynamic pricing based on actual chosen lesson items.

The overall system must remain simple, fast, and intuitive, with the customer journey closely resembling a food-ordering experience.
