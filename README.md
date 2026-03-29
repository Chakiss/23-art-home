# 23 Art Home - QR-Based Art Course Ordering System

A modern, mobile-first web application for ordering art courses designed for children aged 4-12 years. Built with Next.js 14, TypeScript, Tailwind CSS, and Firebase.

## 🎨 Features

### Core Functionality
- **QR Code Entry**: Direct access via QR scan to course selection
- **Custom Course Builder**: Parents can select exactly 5 sessions from available lessons
- **Predefined Courses**: Ready-made course packages
- **Art Supply Add-on**: Upselling art materials and bags
- **Cart Management**: Full cart functionality with item management
- **Checkout Form**: Customer information collection
- **Order Confirmation**: Success page with reference tracking

### Course Types
1. **Custom Main Course (คอร์สหลัก – จัดเองได้)**
   - Select exactly 5 sessions from 6 available lesson types
   - Dynamic pricing based on selected lessons
   - Prices: ฿460-500 per session

2. **Predefined Courses (คอร์สสำเร็จรูป)**
   - 8 ready-made course packages
   - Fixed pricing: ฿2,300-3,000 per course
   - 5 sessions (10 hours) each

3. **Art Supply Add-on (อุปกรณ์เพิ่มเติม)**
   - Art bag with complete supplies
   - Price: ฿800

## 🚀 Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Language**: TypeScript for type safety
- **Backend**: Firebase/Firestore
- **Analytics**: Built-in event tracking
- **Fonts**: Kanit (Thai + Latin support)

## 📱 Mobile-First Design

- Responsive design optimized for mobile devices
- Touch-friendly interface
- Fast loading times
- Offline-capable cart management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Setup Steps

1. **Clone and Install**
```bash
git clone [repository-url]
cd 23-art-home
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

3. **Firebase Setup**
- Create a Firestore database
- Set up the `orders` collection
- Configure security rules

4. **Development**
```bash
npm run dev
```

5. **Build & Deploy**
```bash
npm run build
npm start
```

## 📊 Analytics Events

The application tracks key user interactions:
- `landing_view` - QR scan entry
- `category_view` - Category selection
- `product_view` - Course viewing
- `add_to_cart` - Adding items to cart
- `remove_from_cart` - Removing items
- `custom_course_progress` - Course builder progress
- `custom_course_completed` - Custom course completion
- `checkout_start` - Checkout initiation
- `checkout_submit_success` - Successful order
- `checkout_submit_fail` - Failed order

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── custom-course/     # Custom course builder
│   ├── predefined-courses/ # Course packages
│   ├── accessories/       # Art supplies
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout form
│   └── success/          # Confirmation page
├── components/           # Reusable components
├── hooks/               # React hooks
│   └── useCart.ts       # Cart management
├── lib/                 # Utilities and services
│   ├── firebase.ts      # Firebase config
│   ├── orderService.ts  # Order management
│   └── utils.ts         # Helper functions
└── types/               # TypeScript definitions
    └── index.ts         # All type definitions
```

## 🔧 Key Components

### Cart Management (`useCart` hook)
- Persistent localStorage cart
- Custom course bundle handling
- Quantity management
- Real-time price calculation

### Order Service
- Firebase order submission
- Data validation
- Reference number generation
- Error handling

### Custom Course Builder
- Exactly 5 session requirement
- Dynamic pricing
- Progress tracking
- Session validation

## 🎯 Business Rules

### Custom Courses
- Exactly 5 sessions required
- Price range: ฿460-500 per session
- Repeated sessions allowed
- Total: ฿2,300-2,500 per course

### Validation
- Parent name: minimum 2 characters
- Phone: 10 digits starting with 0
- Student name: minimum 2 characters
- Student age: 4-12 years
- Cart: minimum 1 item

### Order Flow
1. QR scan → Landing
2. Category selection
3. Course/item selection
4. Cart review
5. Checkout form
6. Order submission
7. Confirmation
8. Staff follow-up

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Firebase Hosting
```bash
npm run build
npm run export
firebase deploy
```

### Docker
```bash
docker build -t 23-art-home .
docker run -p 3000:3000 23-art-home
```

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | Yes |
| `NEXT_PUBLIC_GA_TRACKING_ID` | Google Analytics tracking ID | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

Private - All rights reserved to 23 Art Home

## 📞 Support

For technical support or questions:
- Email: dev@23arthome.com
- Phone: 02-xxx-xxxx

---

**Built with ❤️ for 23 Art Home**