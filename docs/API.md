# Casino Games Hosting Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
```
POST /auth/register
Body: { username, email, password }
```

#### Login
```
POST /auth/login
Body: { email, password }
```

### Games

#### Get All Games
```
GET /games
```
Response: List of all available games

#### Get Game by ID
```
GET /games/:id
```

#### Get Games by Type
```
GET /games/type/:type
Types: slot, table, live, crash
```

#### Get Games by Provider
```
GET /games/provider/:provider
Providers: pragmatic, spribe, jili, evolution, etc
```

### Wallet

#### Get Balance
```
GET /wallet/:playerId/balance
```

#### Deposit
```
POST /wallet/:playerId/deposit
Body: { amount, method }
Methods: card, bank, crypto, etc
```

#### Withdraw
```
POST /wallet/:playerId/withdraw
Body: { amount, method }
```

#### Place Bet
```
POST /wallet/:playerId/bet
Body: { amount, gameId }
```

#### Record Win
```
POST /wallet/:playerId/win
Body: { amount, gameId, betId }
```

### Players

#### Get Player Profile
```
GET /players/:playerId
```

#### Update Player Profile
```
PUT /players/:playerId
Body: { username, email }
```

## Response Format

All responses return JSON:
```json
{
  "success": true/false,
  "data": {},
  "error": "error message if any"
}
```

## Error Codes
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Server Error
