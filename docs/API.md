# 📖 API Documentation

The LudoWins Backend provides a comprehensive REST API for mobile clients and administrative interfaces.

## 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user with referral logic. | No |
| `POST` | `/login` | Authenticate user via OTP or password. | No |
| `POST` | `/otp/send` | Request an OTP for registration/login. | No |

## 🎲 Challenges & Gameplay
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/challange/create` | Create a new Ludo battle (₹10 - ₹15,000). | Yes |
| `GET` | `/challange/all` | Fetch all active and running challenges. | Yes |
| `POST` | `/challange/result/:id` | Submit game outcome and proof screenshot. | Yes |
| `PATCH` | `/challange/roomcode/:id`| Update the Ludo King room code. | Yes |

## 💰 Transactions & Wallet
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | Fetch authenticated user profile & balance. | Yes |
| `POST` | `/transaction/deposit` | Initialize a new deposit request. | Yes |
| `POST` | `/withdrawl` | Submit a withdrawal request. | Yes |
| `GET` | `/myTransaction` | View personal transaction history. | Yes |

## 🛠️ Admin Operations
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/challange/all` | View all historical challenges (Admin). | Yes (Admin) |
| `POST` | `/challange/admin/result/:id` | Force resolve a conflict battle. | Yes (Admin) |
| `PATCH` | `/agent/permission/:id` | Update sub-admin/agent permissions. | Yes (Admin) |

## 📁 Media Uploads
All screenshots and profile pictures are handled via `Multer` and optimized using `Sharp` into `.webp` format for performance.
- Profile Pics: `public/profilepic/`
- Game Proofs: `public/gamedoc/`
