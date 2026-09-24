# AgriDirect - Agricultural Supply Chain Mobile-Web Platform

AgriDirect is a digital marketplace mobile app that connects rural farmers directly with urban businesses (like restaurants, hotels, and food groups) to buy fresh food in bulk.

## Project Structure

```
freddy/
├── backend/               # Django REST API backend
│   ├── agridirect/       # Django project settings
│   ├── users/            # User authentication and profiles
│   ├── produce/          # Farm produce listings
│   ├── orders/           # Order management
│   ├── delivery/         # Delivery tracking
│   ├── payments/         # Mobile money payments
│   └── disputes/         # Dispute resolution
└── frontend/             # React Native Expo 57 app
    ├── App.tsx           # Main app entry point
    ├── src/
    │   ├── screens/      # App screens by role
    │   ├── navigation/   # Navigation configuration
    │   ├── context/      # Auth context
    │   └── services/     # API service layer
    └── package.json
```

## User Roles

1. **Farmers/Rural Producers** - Set up profiles, list produce, manage pricing, handle orders, track payments
2. **Urban Bulk Buyers** (Restaurants, Hotels, Caterers, Food Groups) - Browse marketplace, place pre-orders, make payments, track delivery
3. **Delivery Agents/Logistics Partners** - View transport tasks, update transit status, confirm drop-offs
4. **Platform Administrators** - Verify accounts, monitor transactions, resolve disputes

## Backend Setup

### Prerequisites
- Python 3.9+
- Django 6.0.3
- Django REST Framework
- SQLite (default) or PostgreSQL

### Installation

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/`

### API Endpoints

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/token/` - Login (get auth token)
- `GET /api/auth/users/me/` - Get current user profile
- `GET /api/produce/produce/` - List available produce
- `GET /api/produce/produce/search/` - Search produce
- `GET /api/produce/produce/my_listings/` - Farmer's own listings
- `POST /api/produce/produce/` - Create produce listing
- `GET /api/orders/orders/` - List orders
- `POST /api/orders/orders/` - Create order
- `POST /api/orders/orders/{id}/cancel/` - Cancel order
- `POST /api/orders/orders/{id}/confirm/` - Confirm order
- `GET /api/delivery/deliveries/` - List deliveries
- `POST /api/delivery/deliveries/{id}/update_status/` - Update delivery status
- `GET /api/payments/payments/` - List payments
- `POST /api/payments/payments/` - Create payment
- `GET /api/disputes/disputes/` - List disputes
- `POST /api/disputes/disputes/` - Create dispute

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Expo Go app (for mobile testing)

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Running the App

- **Expo Go**: Scan the QR code with the Expo Go app
- **Android**: `npm run android`
- **iOS**: `npm run ios` (requires macOS)
- **Web**: `npm run web`

## Features

### For Farmers
- Register and set up farm profile
- List available produce with prices, quantities, and harvest dates
- Manage produce listings (edit, delete)
- View incoming orders
- Confirm or reject orders
- Track payments from sales

### For Buyers
- Browse verified farm listings
- Search and filter produce by category, region, price
- Place pre-orders or contract agreements
- Make secure payments via integrated mobile money
- Track delivery status
- View order history

### For Delivery Agents
- View assigned transport tasks
- Update delivery status in real-time
- Confirm successful deliveries
- View delivery history

### For Administrators
- Verify farmer and buyer profiles
- Monitor marketplace transactions
- Oversee system operations
- Resolve disputes between users

## Mobile Money Integration

The payment system supports multiple mobile money providers:
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money
- Bank Transfer
- Cash on Delivery

## Tech Stack

### Backend
- Django 6.0.3
- Django REST Framework
- SQLite (development) / PostgreSQL (production)
- Token Authentication

### Frontend
- React Native
- Expo SDK 57
- React Navigation (Stack + Bottom Tabs)
- Axios for API calls
- AsyncStorage for local auth persistence

## Database Schema

### Core Models
- **User** (Custom auth model with role field)
- **FarmerProfile** - Farm details
- **BuyerProfile** - Business details
- **DeliveryAgentProfile** - Delivery agent details
- **Produce** - Farm produce listings
- **ProduceImage** - Produce images
- **Order** - Purchase orders
- **OrderItem** - Individual order items
- **Delivery** - Delivery assignments
- **DeliveryStatusUpdate** - Delivery tracking history
- **Payment** - Payment records
- **PaymentDisbursement** - Farmer payment disbursements
- **Dispute** - Dispute records
- **DisputeMessage** - Dispute messages

## Development Notes

- Backend runs on port 8000
- Frontend API base URL should be configured in `src/services/api.ts`
- Update `CORS_ALLOW_ALL_ORIGINS` for production
- Use environment variables for secret keys in production
- Mobile money integration requires additional API credentials

## Future Enhancements

- Real-time notifications (Firebase Cloud Messaging)
- Image upload for produce listings
- Rating and review system
- Advanced analytics dashboard
- SMS notifications
- Offline mode support
- Multi-language support
