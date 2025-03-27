# Ride Hailing App 🚗

A modern ride-hailing application built with React Native, featuring real-time location tracking, driver-passenger matching, and secure payment processing.

## 🚀 Features

### Completed Features
- **Authentication System**
  - Email/password login
  - User registration
  - Password recovery
  - JWT token management
  - Secure storage implementation

- **User Profile**
  - Profile management
  - Avatar upload
  - Settings configuration
  - Form validation
  - Image optimization

- **Ride Booking**
  - Interactive map interface
  - Google Places Autocomplete
  - Location permission handling
  - Fare estimation
  - Car type selection
  - Real-time location tracking
  - Geocoding implementation
  - Distance calculation

- **Driver Dashboard**
  - Driver approval system
  - Document verification
  - Earnings tracking
  - Trip history
  - Real-time ride requests
  - Ride status management
  - Hazard zone warnings

- **Notifications**
  - Firebase Cloud Messaging
  - Push notification handling
  - Notification center
  - Multiple notification types
  - Read/unread status
  - Background message handling
  - Notification grouping

### In Progress Features
- Real-time driver tracking
- Route visualization
- ETA calculations
- Payment integration
- Ride history
- Rating system
- Offline support
- Dark mode
- Multi-language support

## 🛠 Tech Stack

### Frontend
- React Native
- TypeScript
- Redux Toolkit
- NativeWind (Tailwind CSS)
- React Navigation
- Firebase Cloud Messaging
- Google Maps API
- Socket.io-client

### Backend (In Development)
- Node.js
- Express.js
- MongoDB
- Socket.io
- Redis
- JWT Authentication
- Stripe Payment Integration

## 📱 Screenshots

[Coming Soon]

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- React Native CLI
- Android Studio / Xcode
- Firebase account
- Google Maps API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/mooncakeSG/RideHailingApp.git
cd RideHailingApp
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. iOS specific setup
```bash
cd ios && pod install && cd ..
```

4. Environment setup
Create a `.env` file in the root directory with the following variables:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FIREBASE_API_KEY=your_firebase_api_key
API_URL=your_backend_api_url
```

5. Run the app
```bash
# For iOS
npm run ios
# or
yarn ios

# For Android
npm run android
# or
yarn android
```

## 📁 Project Structure

```
RideHailingApp/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── home.tsx
│   │   ├── ride.tsx
│   │   ├── driver.tsx
│   │   ├── notifications.tsx
│   │   └── profile.tsx
│   └── _layout.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── RideCard.tsx
├── hooks/
│   ├── useFirebaseMessaging.ts
│   └── useLocationTracking.ts
├── store/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── driverSlice.ts
│   │   ├── locationSlice.ts
│   │   ├── notificationSlice.ts
│   │   ├── rideSlice.ts
│   │   └── userSlice.ts
│   └── store.ts
├── utils/
│   └── constants.ts
├── assets/
├── App.tsx
└── package.json
```

## 🔄 Development Status

This project is currently under active development. See [todo.md](todo.md) for detailed development status and upcoming features.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- React Native team
- Expo team
- All contributors and supporters

## 📞 Support

For support, email support@ridehailingapp.com or create an issue in the repository.
