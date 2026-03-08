"""
Example usage of new Sync and Wellness Score endpoints
This script demonstrates how to interact with the new API features.
"""

import requests
import json
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8000"
# You'll need to get a real token by logging in first
AUTH_TOKEN = "your_jwt_token_here"

HEADERS = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json"
}


def print_response(title: str, response: requests.Response):
    """Pretty print API response"""
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    
    try:
        data = response.json()
        print(json.dumps(data, indent=2))
    except:
        print(response.text)


def example_1_sync_demo_data():
    """Example 1: Sync demo data using default mock credentials"""
    print("\n🔄 EXAMPLE 1: Sync Demo Data")
    print("-" * 60)
    
    url = f"{BASE_URL}/api/sync/demo"
    response = requests.post(url, headers=HEADERS)
    
    print_response("POST /api/sync/demo", response)
    
    if response.status_code == 200:
        data = response.json()
        synced = data.get("synced_data", {})
        print(f"\n✅ Synced {data['accounts_synced']} accounts and {data['assets_synced']} assets")
        print(f"💰 Total Net Worth: ${synced.get('total_net_worth', 0):,.2f}")


def example_2_custom_sync():
    """Example 2: Sync with custom credentials"""
    print("\n🔄 EXAMPLE 2: Custom Sync")
    print("-" * 60)
    
    payload = {
        "sync_traditional": True,
        "sync_crypto": True,
        "plaid_access_token": "access-sandbox-12345678-1234-1234-1234-123456789012",
        "crypto_api_key": "crypto-api-demo-key-12345"
    }
    
    url = f"{BASE_URL}/api/sync/"
    response = requests.post(url, json=payload, headers=HEADERS)
    
    print_response("POST /api/sync/", response)


def example_3_get_wellness_score():
    """Example 3: Calculate Financial Wellness Score"""
    print("\n🏥 EXAMPLE 3: Get Wellness Score")
    print("-" * 60)
    
    url = f"{BASE_URL}/api/wellness-score/"
    response = requests.get(url, headers=HEADERS)
    
    print_response("GET /api/wellness-score/", response)
    
    if response.status_code == 200:
        data = response.json()
        if data["success"]:
            health = data["financial_health"]
            print(f"\n📊 FINANCIAL HEALTH SUMMARY")
            print(f"Overall Score: {health['overall_score']:.1f}/100")
            print(f"Grade: {health['grade']}")
            print(f"\nComponent Scores:")
            print(f"  • Diversification: {health['diversification']['diversification_score']:.1f}")
            print(f"  • Liquidity: {health['liquidity']['liquidity_score']:.1f}")
            print(f"  • Behavioral Resilience: {health['behavioral_resilience']['resilience_score']:.1f}")
            print(f"\n💪 Strengths:")
            for strength in health['strengths']:
                print(f"  ✓ {strength}")
            print(f"\n⚠️ Areas for Improvement:")
            for weakness in health['weaknesses']:
                print(f"  • {weakness}")
            print(f"\n💡 Recommendations:")
            for rec in health['recommendations']:
                print(f"  → {rec}")


def example_4_diversification_metrics():
    """Example 4: Get only diversification metrics"""
    print("\n📊 EXAMPLE 4: Diversification Metrics Only")
    print("-" * 60)
    
    url = f"{BASE_URL}/api/wellness-score/metrics/diversification"
    response = requests.get(url, headers=HEADERS)
    
    print_response("GET /api/wellness-score/metrics/diversification", response)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n📈 DIVERSIFICATION ANALYSIS")
        print(f"Asset Classes: {data['asset_class_count']}")
        print(f"Concentration Risk: {data['concentration_risk']:.2f}%")
        print(f"HHI Index: {data['herfindahl_index']:.4f}")
        print(f"Diversification Score: {data['diversification_score']:.1f}/100")
        print(f"\nAsset Distribution:")
        for asset_type, percentage in data['asset_type_distribution'].items():
            print(f"  {asset_type.replace('_', ' ').title()}: {percentage:.1f}%")


def example_5_liquidity_metrics():
    """Example 5: Get only liquidity metrics"""
    print("\n💧 EXAMPLE 5: Liquidity Metrics Only")
    print("-" * 60)
    
    url = f"{BASE_URL}/api/wellness-score/metrics/liquidity"
    response = requests.get(url, headers=HEADERS)
    
    print_response("GET /api/wellness-score/metrics/liquidity", response)
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n💰 LIQUIDITY ANALYSIS")
        print(f"Liquid Assets: ${data['liquid_assets']:,.2f}")
        print(f"Semi-Liquid Assets: ${data['semi_liquid_assets']:,.2f}")
        print(f"Illiquid Assets: ${data['illiquid_assets']:,.2f}")
        print(f"Liquidity Ratio: {data['liquidity_ratio']:.2%}")
        print(f"Emergency Fund: {data['emergency_fund_coverage']:.1f} months")
        print(f"Liquidity Score: {data['liquidity_score']:.1f}/100")


def example_6_recommendations():
    """Example 6: Get personalized recommendations"""
    print("\n💡 EXAMPLE 6: Personalized Recommendations")
    print("-" * 60)
    
    url = f"{BASE_URL}/api/wellness-score/recommendations"
    response = requests.get(url, headers=HEADERS)
    
    print_response("GET /api/wellness-score/recommendations", response)


def example_7_complete_workflow():
    """Example 7: Complete workflow - Sync then Calculate"""
    print("\n🚀 EXAMPLE 7: Complete Workflow")
    print("-" * 60)
    print("Step 1: Sync data from all sources...")
    
    # Step 1: Sync data
    sync_url = f"{BASE_URL}/api/sync/demo"
    sync_response = requests.post(sync_url, headers=HEADERS)
    
    if sync_response.status_code == 200:
        print("✅ Data synced successfully!")
        
        # Step 2: Calculate wellness score
        print("\nStep 2: Calculating wellness score...")
        wellness_url = f"{BASE_URL}/api/wellness-score/"
        wellness_response = requests.get(wellness_url, headers=HEADERS)
        
        if wellness_response.status_code == 200:
            data = wellness_response.json()
            if data["success"]:
                health = data["financial_health"]
                print(f"\n✅ Analysis Complete!")
                print(f"Your Financial Health Score: {health['overall_score']:.1f}/100 ({health['grade']})")
            else:
                print(f"\n⚠️ {data['message']}")
        else:
            print(f"\n❌ Error calculating wellness score: {wellness_response.status_code}")
    else:
        print(f"❌ Error syncing data: {sync_response.status_code}")


def main():
    """Run all examples"""
    print("="*60)
    print("GUARDIAN - API EXAMPLES")
    print("="*60)
    print("\n⚠️  Note: Replace AUTH_TOKEN with your actual JWT token")
    print(f"Base URL: {BASE_URL}")
    
    # Check if token is set
    if AUTH_TOKEN == "your_jwt_token_here":
        print("\n❌ ERROR: Please set your AUTH_TOKEN in the script first!")
        print("\nTo get a token:")
        print("1. Register: POST /api/auth/register")
        print("2. Login: POST /api/auth/login")
        print("3. Copy the 'access_token' from the response")
        print("4. Update AUTH_TOKEN in this script")
        return
    
    # Run examples
    try:
        example_1_sync_demo_data()
        example_2_custom_sync()
        example_3_get_wellness_score()
        example_4_diversification_metrics()
        example_5_liquidity_metrics()
        example_6_recommendations()
        example_7_complete_workflow()
        
        print("\n" + "="*60)
        print("✅ All examples completed!")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to the API")
        print("Make sure the backend is running at http://localhost:8000")
        print("Run: docker-compose up -d")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")


if __name__ == "__main__":
    main()
