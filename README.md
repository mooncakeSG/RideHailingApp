# Ride Hailing App 🚗

A modern React Native application for ride hailing services, featuring real-time ride tracking, status updates, and a seamless user experience for both drivers and passengers.

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
- Socket.IO for real-time communication
- Jest and React Testing Library for testing
- Context API for state management
- React Navigation for routing
- Expo for development and deployment

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
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

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

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Run on your preferred platform
```bash
# For iOS
npm run ios
# For Android
npm run android
```

## 📁 Project Structure

```
RideHailingApp/
├── components/           # Reusable UI components
│   ├── RideProvider.tsx # Context provider for ride state
│   └── RideStatusComponent.tsx # Main ride status component
├── services/           # API and service integrations
├── __tests__/         # Test files
│   ├── components/    # Component tests
│   ├── integration/   # Integration tests
│   └── utils/         # Test utilities
└── App.tsx            # Root component
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

## 🙏 Acknowledgments

- React Native team
- Expo team
- All contributors and supporters


## 🔄 Testing

The project uses Jest and React Testing Library for testing. To run the tests:

```bash
npm test
```

