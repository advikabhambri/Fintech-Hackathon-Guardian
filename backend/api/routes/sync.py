from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from db.database import get_db
from schemas.sync import (
    SyncRequest, 
    SyncResponse, 
    SyncedData, 
    AssetSourceType,
    AggregatedAssets
)
from models.user import User
from core.security import get_current_user
from services.plaid_service import MockPlaidService
from services.crypto_service import MockCryptoService

router = APIRouter()


@router.post("/", response_model=SyncResponse)
async def sync_assets(
    sync_request: SyncRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    POST /sync
    
    Aggregates financial data from multiple sources:
    - Traditional banking/investment via mock Plaid API
    - Cryptocurrency holdings via mock crypto API
    
    This endpoint simulates real-world integrations with financial data providers.
    """
    errors = []
    synced_data = SyncedData(
        source_type=AssetSourceType.MANUAL,
        traditional_accounts=[],
        traditional_assets=[],
        crypto_assets=[],
        total_traditional_value=0.0,
        total_crypto_value=0.0,
        total_net_worth=0.0
    )
    
    accounts_synced = 0
    assets_synced = 0
    
    # Sync traditional banking/investment data
    if sync_request.sync_traditional:
        try:
            # Use provided token or default mock token
            plaid_token = sync_request.plaid_access_token or "access-sandbox-12345678-1234-1234-1234-123456789012"
            
            # Fetch data from mock Plaid service
            plaid_data = MockPlaidService.refresh_data(plaid_token)
            
            if plaid_data.get("success"):
                synced_data.traditional_accounts = plaid_data["accounts"]
                synced_data.traditional_assets = plaid_data["assets"]
                synced_data.total_traditional_value = plaid_data["total_value"]
                accounts_synced += plaid_data["accounts_count"]
                assets_synced += plaid_data["assets_count"]
                synced_data.source_type = AssetSourceType.TRADITIONAL
            else:
                errors.append(f"Plaid sync failed: {plaid_data.get('error', 'Unknown error')}")
        
        except Exception as e:
            errors.append(f"Error syncing traditional assets: {str(e)}")
    
    # Sync cryptocurrency data
    if sync_request.sync_crypto:
        try:
            # Use provided API key or default mock key
            crypto_key = sync_request.crypto_api_key or "crypto-api-demo-key-12345"
            
            # Fetch data from mock crypto service
            crypto_data = MockCryptoService.refresh_portfolio(crypto_key)
            
            if crypto_data.get("success"):
                synced_data.crypto_assets = crypto_data["assets"]
                synced_data.total_crypto_value = crypto_data["total_value"]
                assets_synced += crypto_data["assets_count"]
                
                # Update source type if both synced
                if synced_data.source_type == AssetSourceType.TRADITIONAL:
                    synced_data.source_type = AssetSourceType.MANUAL  # Mixed sources
            else:
                errors.append(f"Crypto sync failed: {crypto_data.get('error', 'Unknown error')}")
        
        except Exception as e:
            errors.append(f"Error syncing crypto assets: {str(e)}")
    
    # Calculate total net worth
    synced_data.total_net_worth = (
        synced_data.total_traditional_value + 
        synced_data.total_crypto_value
    )
    
    # Determine success status
    success = (accounts_synced > 0 or assets_synced > 0) and len(errors) == 0
    
    message = "Data synchronized successfully"
    if errors:
        message = f"Partial sync completed with {len(errors)} error(s)"
    elif accounts_synced == 0 and assets_synced == 0:
        message = "No data synced. Please check your credentials."
        success = False
    
    return SyncResponse(
        success=success,
        message=message,
        synced_data=synced_data,
        accounts_synced=accounts_synced,
        assets_synced=assets_synced,
        errors=errors
    )


@router.get("/summary", response_model=AggregatedAssets)
async def get_aggregated_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    GET /sync/summary
    
    Returns aggregated summary of all synced assets.
    This is a quick overview endpoint for dashboard display.
    """
    # In production, this would fetch from a cache or database
    # For demo purposes, return realistic mock data
    
    from datetime import datetime
    
    # Demo data showing a diversified portfolio
    traditional_total = 487500.00  # Stocks, bonds, 401k
    crypto_total = 125000.00       # Bitcoin, Ethereum, etc.
    alternative_value = 250000.00  # Real estate, private equity
    
    return AggregatedAssets(
        traditional_total=traditional_total,
        crypto_total=crypto_total,
        total_net_worth=traditional_total + crypto_total + alternative_value,
        accounts_count=8,
        assets_count=24,
        last_sync=datetime.utcnow()
    )


@router.post("/demo", response_model=SyncResponse)
async def sync_demo_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    POST /sync/demo
    
    Quickly sync demo data using default mock credentials.
    Useful for testing and demonstrations.
    """
    demo_request = SyncRequest(
        sync_traditional=True,
        sync_crypto=True,
        plaid_access_token="access-sandbox-12345678-1234-1234-1234-123456789012",
        crypto_api_key="crypto-api-demo-key-12345"
    )
    
    return await sync_assets(demo_request, current_user, db)
