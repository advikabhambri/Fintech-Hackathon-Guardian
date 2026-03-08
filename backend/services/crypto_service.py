"""
Mock Crypto API Service
Simulates fetching cryptocurrency portfolio data
"""

from typing import List, Dict, Any
import random
from schemas.sync import CryptoAsset


class MockCryptoService:
    """Mock implementation of cryptocurrency exchange API"""
    
    # Popular cryptocurrencies with real-world context
    CRYPTO_CURRENCIES = [
        {"symbol": "BTC", "name": "Bitcoin", "typical_price": 45000},
        {"symbol": "ETH", "name": "Ethereum", "typical_price": 2500},
        {"symbol": "BNB", "name": "Binance Coin", "typical_price": 350},
        {"symbol": "SOL", "name": "Solana", "typical_price": 100},
        {"symbol": "ADA", "name": "Cardano", "typical_price": 0.50},
        {"symbol": "DOT", "name": "Polkadot", "typical_price": 7.5},
        {"symbol": "MATIC", "name": "Polygon", "typical_price": 0.85},
        {"symbol": "LINK", "name": "Chainlink", "typical_price": 15},
        {"symbol": "AVAX", "name": "Avalanche", "typical_price": 35},
        {"symbol": "UNI", "name": "Uniswap", "typical_price": 8}
    ]
    
    NETWORKS = ["ethereum", "binance-smart-chain", "solana", "polygon"]
    
    @staticmethod
    def validate_api_key(api_key: str) -> bool:
        """Validate mock crypto API key"""
        # In production, this would verify with actual exchange API
        return api_key and (api_key.startswith("crypto-api-") or api_key == "demo-key")
    
    @staticmethod
    def get_portfolio(api_key: str) -> List[CryptoAsset]:
        """
        Mock fetching cryptocurrency portfolio
        Returns holdings across various cryptocurrencies
        """
        if not MockCryptoService.validate_api_key(api_key):
            return []
        
        assets = []
        
        # Generate random portfolio of 3-7 different cryptocurrencies
        num_holdings = random.randint(3, 7)
        selected_cryptos = random.sample(
            MockCryptoService.CRYPTO_CURRENCIES, 
            num_holdings
        )
        
        for crypto in selected_cryptos:
            # Add some price volatility (±20% from typical price)
            price_variance = random.uniform(0.8, 1.2)
            current_price = crypto["typical_price"] * price_variance
            
            # Generate realistic quantities based on price
            if current_price > 1000:  # BTC, ETH
                quantity = random.uniform(0.01, 5.0)
            elif current_price > 100:  # SOL, BNB, AVAX
                quantity = random.uniform(1, 50)
            else:  # Lower-priced coins
                quantity = random.uniform(100, 10000)
            
            value = quantity * current_price
            
            # Simulate cost basis (±30% from current value)
            cost_basis = value * random.uniform(0.7, 1.3)
            
            # Generate mock wallet address
            wallet_address = MockCryptoService._generate_wallet_address()
            
            assets.append(CryptoAsset(
                symbol=crypto["symbol"],
                name=crypto["name"],
                quantity=round(quantity, 8),
                price_usd=round(current_price, 2),
                value_usd=round(value, 2),
                cost_basis=round(cost_basis, 2),
                wallet_address=wallet_address,
                network=random.choice(MockCryptoService.NETWORKS)
            ))
        
        return assets
    
    @staticmethod
    def _generate_wallet_address() -> str:
        """Generate mock wallet address"""
        return "0x" + "".join(
            random.choices("0123456789abcdef", k=40)
        )
    
    @staticmethod
    def get_current_prices(symbols: List[str]) -> Dict[str, float]:
        """
        Mock fetching current prices for given crypto symbols
        """
        prices = {}
        for symbol in symbols:
            crypto = next(
                (c for c in MockCryptoService.CRYPTO_CURRENCIES 
                 if c["symbol"] == symbol), 
                None
            )
            if crypto:
                # Add price volatility
                price_variance = random.uniform(0.95, 1.05)
                prices[symbol] = round(
                    crypto["typical_price"] * price_variance, 
                    2
                )
        return prices
    
    @staticmethod
    def refresh_portfolio(api_key: str) -> Dict[str, Any]:
        """
        Mock complete portfolio refresh
        Returns all holdings with current prices
        """
        if not MockCryptoService.validate_api_key(api_key):
            return {
                "success": False,
                "error": "Invalid API key"
            }
        
        assets = MockCryptoService.get_portfolio(api_key)
        total_value = sum(asset.value_usd for asset in assets)
        total_cost_basis = sum(
            asset.cost_basis for asset in assets if asset.cost_basis
        )
        
        profit_loss = total_value - total_cost_basis if total_cost_basis else 0
        profit_loss_pct = (
            (profit_loss / total_cost_basis * 100) if total_cost_basis > 0 else 0
        )
        
        return {
            "success": True,
            "assets": assets,
            "total_value": round(total_value, 2),
            "total_cost_basis": round(total_cost_basis, 2),
            "profit_loss": round(profit_loss, 2),
            "profit_loss_percentage": round(profit_loss_pct, 2),
            "assets_count": len(assets)
        }
    
    @staticmethod
    def get_market_data(symbol: str) -> Dict[str, Any]:
        """
        Mock market data for a specific cryptocurrency
        """
        crypto = next(
            (c for c in MockCryptoService.CRYPTO_CURRENCIES 
             if c["symbol"] == symbol), 
            None
        )
        
        if not crypto:
            return {"error": "Symbol not found"}
        
        current_price = crypto["typical_price"] * random.uniform(0.95, 1.05)
        
        return {
            "symbol": symbol,
            "name": crypto["name"],
            "current_price": round(current_price, 2),
            "24h_change": round(random.uniform(-10, 10), 2),
            "24h_volume": random.randint(1000000, 10000000000),
            "market_cap": random.randint(1000000000, 1000000000000),
            "circulating_supply": random.randint(1000000, 21000000)
        }


# Convenience function to get mock API key for testing
def get_mock_crypto_api_key() -> str:
    """Returns a valid mock crypto API key for testing"""
    return "crypto-api-demo-key-12345"
