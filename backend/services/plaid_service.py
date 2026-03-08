"""
Mock Plaid API Service
Simulates fetching traditional banking and investment data
"""

from typing import List, Dict, Any
import random
from schemas.sync import TraditionalAccount, TraditionalAsset


class MockPlaidService:
    """Mock implementation of Plaid API for traditional financial data"""
    
    # Mock institutions
    INSTITUTIONS = [
        "Chase Bank", "Bank of America", "Wells Fargo", "Citi Bank",
        "Vanguard", "Fidelity", "Charles Schwab", "TD Ameritrade"
    ]
    
    # Mock stocks
    STOCKS = [
        {"symbol": "AAPL", "name": "Apple Inc."},
        {"symbol": "GOOGL", "name": "Alphabet Inc."},
        {"symbol": "MSFT", "name": "Microsoft Corporation"},
        {"symbol": "AMZN", "name": "Amazon.com Inc."},
        {"symbol": "TSLA", "name": "Tesla Inc."},
        {"symbol": "NVDA", "name": "NVIDIA Corporation"},
        {"symbol": "META", "name": "Meta Platforms Inc."},
        {"symbol": "V", "name": "Visa Inc."},
        {"symbol": "JPM", "name": "JPMorgan Chase & Co."},
        {"symbol": "WMT", "name": "Walmart Inc."}
    ]
    
    @staticmethod
    def validate_access_token(access_token: str) -> bool:
        """Validate mock access token"""
        # In production, this would verify with Plaid API
        return access_token and access_token.startswith("access-sandbox-")
    
    @staticmethod
    def get_accounts(access_token: str) -> List[TraditionalAccount]:
        """
        Mock fetching bank accounts from Plaid
        Returns checking, savings, investment, and credit card accounts
        """
        if not MockPlaidService.validate_access_token(access_token):
            return []
        
        accounts = []
        
        # Generate mock checking account
        accounts.append(TraditionalAccount(
            account_id="acc_checking_001",
            account_name="Primary Checking",
            account_type="checking",
            balance=random.uniform(2000, 15000),
            available=random.uniform(1800, 14000),
            currency="USD",
            institution_name=random.choice(MockPlaidService.INSTITUTIONS[:4])
        ))
        
        # Generate mock savings account
        accounts.append(TraditionalAccount(
            account_id="acc_savings_002",
            account_name="High-Yield Savings",
            account_type="savings",
            balance=random.uniform(10000, 50000),
            available=random.uniform(10000, 50000),
            currency="USD",
            institution_name=random.choice(MockPlaidService.INSTITUTIONS[:4])
        ))
        
        # Generate mock investment accounts
        for i in range(random.randint(1, 3)):
            accounts.append(TraditionalAccount(
                account_id=f"acc_investment_{100 + i}",
                account_name=f"Investment Account {i + 1}",
                account_type="investment",
                balance=random.uniform(50000, 500000),
                available=None,
                currency="USD",
                institution_name=random.choice(MockPlaidService.INSTITUTIONS[4:])
            ))
        
        # Generate mock credit card
        accounts.append(TraditionalAccount(
            account_id="acc_credit_003",
            account_name="Rewards Credit Card",
            account_type="credit_card",
            balance=-random.uniform(500, 5000),  # Negative for debt
            available=random.uniform(5000, 20000),
            currency="USD",
            institution_name=random.choice(MockPlaidService.INSTITUTIONS[:4])
        ))
        
        return accounts
    
    @staticmethod
    def get_investment_holdings(access_token: str, account_ids: List[str]) -> List[TraditionalAsset]:
        """
        Mock fetching investment holdings from Plaid
        Returns stocks, bonds, ETFs held in investment accounts
        """
        if not MockPlaidService.validate_access_token(access_token):
            return []
        
        assets = []
        
        for account_id in account_ids:
            # Generate random number of holdings per account
            num_holdings = random.randint(3, 8)
            selected_stocks = random.sample(MockPlaidService.STOCKS, num_holdings)
            
            for stock in selected_stocks:
                quantity = random.uniform(1, 100)
                price = random.uniform(50, 500)
                cost_basis = price * random.uniform(0.7, 1.3)  # Simulate gains/losses
                
                assets.append(TraditionalAsset(
                    symbol=stock["symbol"],
                    name=stock["name"],
                    quantity=round(quantity, 2),
                    price=round(price, 2),
                    value=round(quantity * price, 2),
                    cost_basis=round(cost_basis * quantity, 2),
                    account_id=account_id
                ))
        
        return assets
    
    @staticmethod
    def refresh_data(access_token: str) -> Dict[str, Any]:
        """
        Mock data refresh from Plaid
        Returns complete account and holdings data
        """
        if not MockPlaidService.validate_access_token(access_token):
            return {
                "success": False,
                "error": "Invalid access token"
            }
        
        accounts = MockPlaidService.get_accounts(access_token)
        
        # Get investment account IDs
        investment_account_ids = [
            acc.account_id for acc in accounts 
            if acc.account_type == "investment"
        ]
        
        assets = MockPlaidService.get_investment_holdings(
            access_token, 
            investment_account_ids
        )
        
        total_value = sum(acc.balance for acc in accounts if acc.balance > 0)
        
        return {
            "success": True,
            "accounts": accounts,
            "assets": assets,
            "total_value": round(total_value, 2),
            "accounts_count": len(accounts),
            "assets_count": len(assets)
        }


# Convenience function to get mock access token for testing
def get_mock_plaid_token() -> str:
    """Returns a valid mock Plaid access token for testing"""
    return "access-sandbox-12345678-1234-1234-1234-123456789012"
