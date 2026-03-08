from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class AssetSourceType(str, Enum):
    TRADITIONAL = "traditional"
    CRYPTO = "crypto"
    MANUAL = "manual"


class TraditionalAccount(BaseModel):
    account_id: str
    account_name: str
    account_type: str  # checking, savings, investment, credit_card
    balance: float
    available: Optional[float] = None
    currency: str = "USD"
    institution_name: str


class TraditionalAsset(BaseModel):
    symbol: str
    name: str
    quantity: float
    price: float
    value: float
    cost_basis: Optional[float] = None
    account_id: str


class CryptoAsset(BaseModel):
    symbol: str
    name: str
    quantity: float
    price_usd: float
    value_usd: float
    cost_basis: Optional[float] = None
    wallet_address: Optional[str] = None
    network: Optional[str] = None  # ethereum, bitcoin, solana, etc.


class SyncRequest(BaseModel):
    user_id: Optional[int] = None
    sync_traditional: bool = True
    sync_crypto: bool = True
    plaid_access_token: Optional[str] = None
    crypto_api_key: Optional[str] = None


class SyncedData(BaseModel):
    traditional_accounts: List[TraditionalAccount] = []
    traditional_assets: List[TraditionalAsset] = []
    crypto_assets: List[CryptoAsset] = []
    total_traditional_value: float = 0.0
    total_crypto_value: float = 0.0
    total_net_worth: float = 0.0
    sync_timestamp: datetime = Field(default_factory=datetime.utcnow)
    source_type: AssetSourceType


class SyncResponse(BaseModel):
    success: bool
    message: str
    synced_data: Optional[SyncedData] = None
    accounts_synced: int = 0
    assets_synced: int = 0
    errors: List[str] = []


class AggregatedAssets(BaseModel):
    traditional_total: float
    crypto_total: float
    total_net_worth: float
    accounts_count: int
    assets_count: int
    last_sync: Optional[datetime] = None
