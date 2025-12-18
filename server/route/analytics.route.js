// server/route/analytics.route.js
import express from "express";
import analytics from "../controllers/analytics.controller.js";


import { getLoginActivity } from "../controllers/loginAnalytics.controller.js";
const analyticsRouter = express.Router();

// Visitor analytics
analyticsRouter.get("/visitors/unique", analytics.uniqueVisitors);         // 1A
analyticsRouter.get("/visitors/new-vs-returning", analytics.newVsReturning); // 1B
analyticsRouter.get("/visitors/device", analytics.deviceDistribution);     // 1C
analyticsRouter.get("/visitors/browser", analytics.browserDistribution);   // 1D
analyticsRouter.get("/visitors/country", analytics.countryDistribution);   // 1E
analyticsRouter.get("/visitors/country", analytics.countryDistribution);   // 1E
analyticsRouter.get("/visitors/unique-range", analytics.getUniqueVisitorsInRange); // 1F
analyticsRouter.get("/visitors/bucketed", analytics.getUniqueVisitorsBucketed); // 1G

// Session analytics
analyticsRouter.get("/sessions/avg-duration", analytics.avgSessionDuration); // 2A
analyticsRouter.get("/sessions/bounce-rate", analytics.bounceRate);          // 2B
analyticsRouter.get("/sessions/pages-per-session", analytics.pagesPerSession); // 2C

// Page analytics
analyticsRouter.get("/pages/most-viewed", analytics.mostViewedPages);        // 3A
analyticsRouter.get("/pages/scroll-depth", analytics.avgScrollDepth);       // 3B
analyticsRouter.get("/pages/time-spent", analytics.timeSpentPerPage);  
analyticsRouter.get("/pages/timeSpent", analytics.mostTimeSpentPages);
     // 3C
analyticsRouter.get("/timeSpent/userType", analytics.timeSpentByUserType);
analyticsRouter.get("/timeSpent/device", analytics.timeSpentByDevice);
analyticsRouter.get("/scrollDepth/top", analytics.scrollDepthStats);




// Conversion / product funnel
analyticsRouter.get("/funnel/product", analytics.productFunnel);            // 4A


analyticsRouter.get("/timeSpent/products", analytics.mostTimeSpentProducts);


// Search analytics
analyticsRouter.get("/search/top-keywords", analytics.topSearchKeywords);   // 5A
analyticsRouter.get("/search/zero-results", analytics.zeroResultSearches);  // 5B
analyticsRouter.get("/search/volume", analytics.searchVolume);   



analyticsRouter.get("/search/zero-results", analytics.zeroResultSearches);
analyticsRouter.get("/search/top-categories", analytics.topSearchedCategories);
analyticsRouter.get("/search/funnel", analytics.searchConversionFunnel);
analyticsRouter.get("/search/intents", analytics.searchIntentClusters);

// 5C

// User analytics
analyticsRouter.get("/users/daily-logins", analytics.dailyLogins);          // 6A
analyticsRouter.get("/users/new-signups", analytics.newSignups);            // 6B
analyticsRouter.get("/timeSpent/topUsers", analytics.topUsersByTimeSpent);
analyticsRouter.get("/timeSpent/userPages", analytics.userTopPages);

analyticsRouter.get("/search/most", analytics.mostSearchedKeywords);



// Product analytics
analyticsRouter.get("/products/most-viewed", analytics.mostViewedProducts); // 7A
analyticsRouter.get("/products/most-wishlisted", analytics.mostWishlisted); // wishlist leaderboard




analyticsRouter.get("/active-users", analytics.getActiveUsers);
analyticsRouter.get("/active-users/device", analytics.activeUsersByDevice);
analyticsRouter.get("/live/pages", analytics.liveTopPages);
analyticsRouter.get("/user/pages", analytics.userPageEngagement);
analyticsRouter.get("/live/users", analytics.getLiveUsers); 

analyticsRouter.get("/logins/activity", getLoginActivity);

export default analyticsRouter;
