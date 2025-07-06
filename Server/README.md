# WalmartHack Backend

This is a Node.js backend using Clean Architecture principles. It includes a mocked smart contract service and a sample endpoint.

## Structure

- `src/app.js`: Entry point
- `src/routes/`: API routes
- `src/controllers/`: Request handlers
- `src/usecases/`: Business logic
- `src/entities/`: Domain entities
- `src/repositories/`: Data access (mocked)
- `src/services/`: External services (mocked smart contract)

## Usage

1. Install dependencies:
   ```zsh
   npm install
   ```
2. Start the server:
   ```zsh
   npm start
   ```
3. Test the API:
   ```zsh
   curl -X POST http://localhost:3000/api/action -H 'Content-Type: application/json' -d '{"test":123}'
   ```

You will receive a mocked smart contract response.
