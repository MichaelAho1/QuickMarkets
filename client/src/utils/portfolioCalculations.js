// Portfolio calculation utilities
export const calculatePortfolioValues = (portfolioData, stockPrices) => {
    if (!portfolioData || !stockPrices) {
        return {
            portfolio: [],
            summary: {
                totalPortfolioValue: 0,
                totalCostBasis: 0,
                overallProfitLoss: 0,
                overallProfitLossPercent: 0,
                totalNetWorth: portfolioData?.summary?.cashBalance || 0
            }
        };
    }

    const calculatedPortfolio = [];
    let totalPortfolioValue = 0;
    let totalCostBasis = 0;

    // Calculate values for each stock in portfolio
    portfolioData.portfolio.forEach(portfolioStock => {
        const stockPrice = stockPrices.find(stock => stock.ticker === portfolioStock.ticker);
        
        if (stockPrice) {
            const currentPrice = stockPrice.currPrice;
            const openingPrice = stockPrice.prevPrice;
            const shares = portfolioStock.shares;
            const averageCost = portfolioStock.averageCost;
            
            const currentValue = currentPrice * shares;
            const costBasis = averageCost * shares;
            const profitLoss = currentValue - costBasis;
            const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;
            
            const calculatedStock = {
                symbol: portfolioStock.ticker,
                name: portfolioStock.stockName,
                shares: shares,
                avgCost: averageCost,
                currentPrice: currentPrice,
                openingPrice: openingPrice,
                totalValue: currentValue,
                profitLoss: profitLoss,
                profitLossPercentage: profitLossPercent,
                sector: portfolioStock.sector
            };
            
            calculatedPortfolio.push(calculatedStock);
            totalPortfolioValue += currentValue;
            totalCostBasis += costBasis;
        }
    });

    const overallProfitLoss = totalPortfolioValue - totalCostBasis;
    const overallProfitLossPercent = totalCostBasis > 0 ? (overallProfitLoss / totalCostBasis) * 100 : 0;
    const totalNetWorth = totalPortfolioValue + (portfolioData.summary.cashBalance || 0);

    return {
        portfolio: calculatedPortfolio,
        summary: {
            totalPortfolioValue,
            totalCostBasis,
            overallProfitLoss,
            overallProfitLossPercent,
            cashBalance: portfolioData.summary.cashBalance || 0,
            totalNetWorth
        }
    };
};

// Calculate portfolio value for dashboard
export const calculatePortfolioSummary = (portfolioData, stockPrices) => {
    if (!portfolioData || !stockPrices) {
        return {
            totalNetWorth: portfolioData?.summary?.cashBalance || 0,
            portfolioDayChange: 0
        };
    }

    const { summary } = calculatePortfolioValues(portfolioData, stockPrices);
    
    return {
        totalNetWorth: summary.totalNetWorth,
        portfolioDayChange: summary.overallProfitLossPercent
    };
};
