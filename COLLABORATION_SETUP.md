# Guardian - Collaboration Setup Guide

## Fixed Issues ✅

1. **Port Mismatch**: Fixed frontend API URL to use port 8000 (was 8001)
2. **CORS Policy**: Updated to allow all origins for development collaboration
3. **Backend Server**: Started and running on all network interfaces

## For the Host Machine (Your Computer)

The backend is now running at:
- **Local**: `http://localhost:8000`
- **Network**: `http://192.168.0.124:8000`
- **Status**: Check at `http://localhost:8000/health`

### Starting the Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Starting the Frontend

```bash
cd frontend
npm run dev
```

## For Collaborators on the Same Network

### Option 1: Use Host's Network IP (Recommended for Same Network)

1. **Get the host's IP address** (already found: `192.168.0.124`)

2. **Update your local environment**:
   - Copy the file `frontend/.env.network` to `frontend/.env`
   - Verify the IP matches the host's current IP
   
3. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Start the frontend**:
   ```bash
   npm run dev
   ```

5. **Access the app**:
   - Open `http://localhost:5173` in your browser
   - The frontend will connect to the host's backend at `http://192.168.0.124:8000`

### Option 2: Run Full Stack on Each Machine

Each collaborator can run both backend and frontend locally:

1. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Firewall Configuration

### macOS Host (Your Machine)
Allow incoming connections on port 8000:
```bash
# Check firewall status
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# If enabled, allow Python/uvicorn
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add $(which python)
```

### Windows Host
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Add inbound rule for port 8000
4. Allow the connection

## Testing the Connection

### From Host Machine
```bash
# Test backend
curl http://localhost:8000/health

# Should return: {"status":"healthy","service":"Guardian API"}
```

### From Collaborator's Machine
```bash
# Test backend connectivity (replace with actual host IP)
curl http://192.168.0.124:8000/health

# Should return: {"status":"healthy","service":"Guardian API"}
```

## Common Issues

### "Cannot connect to backend"
- ✅ Verify backend is running: `curl http://localhost:8000/health`
- ✅ Check firewall settings allow port 8000
- ✅ Confirm both machines are on the same network
- ✅ Verify the IP address in `.env` is correct

### "CORS error"
- ✅ Backend is now configured to accept all origins for development
- ✅ Clear browser cache and restart frontend

### "Authentication fails"
- ✅ Backend must be running before attempting login/signup
- ✅ Each collaborator needs their own account (use Register page)
- ✅ Check browser console for detailed error messages

## Production Deployment

For production use:

1. **Deploy backend** to a cloud service (Heroku, Railway, AWS, etc.)
2. **Update CORS** in `backend/main.py` to only allow your frontend domain
3. **Set environment variables**:
   - `VITE_API_URL=https://your-backend-domain.com`
4. **Deploy frontend** to Vercel, Netlify, or similar

## Current Network Configuration

- **Host IP**: `192.168.0.124`
- **Backend Port**: `8000`
- **Frontend Port**: `5173`
- **CORS**: Enabled for all origins (development mode)

## Security Note

⚠️ The current CORS configuration (`allow_origins=["*"]`) is for development/collaboration only. 
For production, update `backend/main.py` to specify exact allowed origins.
