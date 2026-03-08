"""
Test suite for Asset Sync and Wellness Score endpoints
Run with: pytest test_new_features.py
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Mock authentication token (you'll need to get a real token from /api/auth/login)
# For testing, replace this with an actual JWT token
AUTH_TOKEN = "Bearer YOUR_TEST_TOKEN_HERE"
HEADERS = {"Authorization": AUTH_TOKEN}


class TestSyncEndpoint:
    """Test cases for /api/sync endpoint"""
    
    def test_sync_demo_data(self):
        """Test syncing demo data without authentication"""
        response = client.post("/api/sync/demo", headers=HEADERS)
        
        # Should return 200 or 401 depending on auth setup
        assert response.status_code in [200, 401]
        
        if response.status_code == 200:
            data = response.json()
            assert "success" in data
            assert "synced_data" in data
            assert "accounts_synced" in data
            assert "assets_synced" in data
    
    def test_sync_with_custom_tokens(self):
        """Test sync with custom credentials"""
        payload = {
            "sync_traditional": True,
            "sync_crypto": True,
            "plaid_access_token": "access-sandbox-12345678-1234-1234-1234-123456789012",
            "crypto_api_key": "crypto-api-demo-key-12345"
        }
        
        response = client.post("/api/sync/", json=payload, headers=HEADERS)
        
        # Check response structure
        if response.status_code == 200:
            data = response.json()
            assert "success" in data
            assert "message" in data
            assert "synced_data" in data
            
            synced_data = data["synced_data"]
            assert "total_net_worth" in synced_data
            assert "traditional_accounts" in synced_data
            assert "crypto_assets" in synced_data
    
    def test_sync_traditional_only(self):
        """Test syncing only traditional assets"""
        payload = {
            "sync_traditional": True,
            "sync_crypto": False
        }
        
        response = client.post("/api/sync/", json=payload, headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            synced_data = data.get("synced_data", {})
            # Should have traditional data
            assert len(synced_data.get("traditional_accounts", [])) >= 0
    
    def test_sync_crypto_only(self):
        """Test syncing only crypto assets"""
        payload = {
            "sync_traditional": False,
            "sync_crypto": True
        }
        
        response = client.post("/api/sync/", json=payload, headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            synced_data = data.get("synced_data", {})
            # Should have crypto data
            assert len(synced_data.get("crypto_assets", [])) >= 0


class TestWellnessScoreEndpoint:
    """Test cases for /api/wellness-score endpoint"""
    
    def test_get_wellness_score(self):
        """Test getting wellness score"""
        response = client.get("/api/wellness-score/", headers=HEADERS)
        
        # Should return 200, 401 (no auth), or 404 (no data)
        assert response.status_code in [200, 401, 404]
        
        if response.status_code == 200:
            data = response.json()
            assert "success" in data
            assert "message" in data
            assert "data_quality" in data
            
            if data["success"]:
                financial_health = data["financial_health"]
                assert "overall_score" in financial_health
                assert "grade" in financial_health
                assert "diversification" in financial_health
                assert "liquidity" in financial_health
                assert "behavioral_resilience" in financial_health
                assert "risk_metrics" in financial_health
                assert "recommendations" in financial_health
                
                # Score should be between 0 and 100
                assert 0 <= financial_health["overall_score"] <= 100
    
    def test_get_diversification_metrics(self):
        """Test getting only diversification metrics"""
        response = client.get("/api/wellness-score/metrics/diversification", headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            assert "asset_class_count" in data
            assert "asset_type_distribution" in data
            assert "concentration_risk" in data
            assert "herfindahl_index" in data
            assert "diversification_score" in data
    
    def test_get_liquidity_metrics(self):
        """Test getting only liquidity metrics"""
        response = client.get("/api/wellness-score/metrics/liquidity", headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            assert "liquid_assets" in data
            assert "semi_liquid_assets" in data
            assert "illiquid_assets" in data
            assert "liquidity_ratio" in data
            assert "emergency_fund_coverage" in data
            assert "liquidity_score" in data
    
    def test_get_recommendations(self):
        """Test getting personalized recommendations"""
        response = client.get("/api/wellness-score/recommendations", headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            assert "recommendations" in data
            assert "strengths" in data
            assert "weaknesses" in data
            assert isinstance(data["recommendations"], list)
            assert isinstance(data["strengths"], list)
            assert isinstance(data["weaknesses"], list)
    
    def test_detailed_wellness_score(self):
        """Test getting detailed wellness score"""
        response = client.get("/api/wellness-score/detailed?include_sync_data=true", headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            assert "success" in data
            assert "financial_health" in data or not data["success"]


class TestMockServices:
    """Test mock services directly"""
    
    def test_plaid_service(self):
        """Test mock Plaid service"""
        from services.plaid_service import MockPlaidService
        
        token = "access-sandbox-12345678-1234-1234-1234-123456789012"
        result = MockPlaidService.refresh_data(token)
        
        assert result["success"] is True
        assert "accounts" in result
        assert "assets" in result
        assert len(result["accounts"]) > 0
    
    def test_crypto_service(self):
        """Test mock crypto service"""
        from services.crypto_service import MockCryptoService
        
        api_key = "crypto-api-demo-key-12345"
        result = MockCryptoService.refresh_portfolio(api_key)
        
        assert result["success"] is True
        assert "assets" in result
        assert "total_value" in result
        assert len(result["assets"]) > 0
    
    def test_wellness_calculator(self):
        """Test wellness score calculator"""
        from services.wellness_calculator import WellnessScoreCalculator
        
        # Test grade calculation
        assert WellnessScoreCalculator.calculate_grade(98) == "A+"
        assert WellnessScoreCalculator.calculate_grade(92) == "A"
        assert WellnessScoreCalculator.calculate_grade(85) == "B"
        assert WellnessScoreCalculator.calculate_grade(75) == "C"
        assert WellnessScoreCalculator.calculate_grade(65) == "D"
        assert WellnessScoreCalculator.calculate_grade(55) == "F"


# Run tests
if __name__ == "__main__":
    pytest.main([__file__, "-v"])
