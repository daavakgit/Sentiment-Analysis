export const mockReviews = [
  {
    id: 1,
    customerName: "Aarav Patel",
    date: "2023-10-25",
    time: "14:30",
    rating: 5,
    text: "Absolutely loved the biryani! The delivery was super fast and the packaging was premium. Will order again.",
    sentiment: "positive",
    score: 0.95,
    categories: ["Food Quality", "Delivery", "Packaging"],
    keywords: ["Biryani", "Fast", "Premium"],
    orderItems: ["Chicken Biryani", "Raita", "Gulab Jamun"]
  },
  {
    id: 2,
    customerName: "Sneha Gupta",
    date: "2023-10-24",
    time: "20:15",
    rating: 2,
    text: "Food was cold by the time it arrived. Very disappointed with the delivery service today.",
    sentiment: "negative",
    score: -0.6,
    categories: ["Delivery", "Temperature"],
    keywords: ["Cold", "Late", "Disappointed"],
    orderItems: ["Paneer Butter Masala", "Naan"]
  },
  {
    id: 3,
    customerName: "Rahul Sharma",
    date: "2023-10-24",
    time: "13:45",
    rating: 4,
    text: "Great taste, but portion size could be a bit better for the price. Overall good experience.",
    sentiment: "positive",
    score: 0.4,
    categories: ["Food Quality", "Value for Money"],
    keywords: ["Great Taste", "Small Portion"],
    orderItems: ["Veg Thali"]
  },
  {
    id: 4,
    customerName: "Priya Singh",
    date: "2023-10-23",
    time: "19:00",
    rating: 1,
    text: "Found a hair in my food! This is unacceptable hygiene standards. requesting a full refund immediately.",
    sentiment: "negative",
    score: -0.95,
    categories: ["Hygiene", "Service"],
    keywords: ["Hair", "Unacceptable", "Refund"],
    orderItems: ["Fried Rice", "Manchurian"]
  },
  {
    id: 5,
    customerName: "Vikram Malhotra",
    date: "2023-10-23",
    time: "21:30",
    rating: 3,
    text: "It was okay. Not the best butter chicken I've had, but edible. Delivery was on time though.",
    sentiment: "neutral",
    score: 0.1,
    categories: ["Food Quality", "Delivery"],
    keywords: ["Average", "On Time"],
    orderItems: ["Butter Chicken", "Jeera Rice"]
  },
  {
    id: 6,
    customerName: "Ananya Roy",
    date: "2023-10-22",
    time: "12:15",
    rating: 5,
    text: "Zomato Gold privileges are totally worth it! Saved so much on this order. The food was hot and delicious.",
    sentiment: "positive",
    score: 0.85,
    categories: ["Value for Money", "Food Quality"],
    keywords: ["Savings", "Hot", "Delicious"],
    orderItems: ["Pizza", "Garlic Bread"]
  },
  {
    id: 7,
    customerName: "Karan Johar",
    date: "2023-10-22",
    time: "15:00",
    rating: 4,
    text: "Nice packaging. The delivery partner was very polite. Coffee spilled a little though.",
    sentiment: "positive",
    score: 0.7,
    categories: ["Packaging", "Delivery"],
    keywords: ["Polite", "Spill"],
    orderItems: ["Iced Latte", "Croissant"]
  },
  {
    id: 8,
    customerName: "Mira Rajput",
    date: "2023-10-21",
    time: "22:00",
    rating: 2,
    text: "Too spicy! I specifically asked for mild. They ignored the cooking instructions.",
    sentiment: "negative",
    score: -0.5,
    categories: ["Food Quality", "Service"],
    keywords: ["Spicy", "Ignored Instructions"],
    orderItems: ["Hakka Noodles", "Chilli Chicken"]
  },
  {
    id: 9,
    customerName: "Suresh Raina",
    date: "2023-10-20",
    time: "18:45",
    rating: 5,
    text: "Perfect implementation of contactless delivery. Safe and tasty.",
    sentiment: "positive",
    score: 0.9,
    categories: ["Delivery", "Food Quality"],
    keywords: ["Safe", "Tasty", "Contactless"],
    orderItems: ["Burger", "Fries"]
  },
  {
    id: 10,
    customerName: "Neha Kakkar",
    date: "2023-10-20",
    time: "14:00",
    rating: 3,
    text: "Average experience. Nothing to write home about.",
    sentiment: "neutral",
    score: 0.0,
    categories: ["General"],
    keywords: ["Average"],
    orderItems: ["Sandwich", "Juice"]
  },
  {
    id: 11,
    customerName: "Amitabh B.",
    date: "2023-10-19",
    time: "20:30",
    rating: 1,
    text: "Order never arrived! App shows delivered. Customer support is not responding.",
    sentiment: "negative",
    score: -0.98,
    categories: ["Delivery", "Support"],
    keywords: ["Not Arrived", "No Response"],
    orderItems: ["Family Meal Deal"]
  },
  {
    id: 12,
    customerName: "Deepika P.",
    date: "2023-10-19",
    time: "21:00",
    rating: 5,
    text: "Desserts were heavenly. Best chocolate mousse ever!",
    sentiment: "positive",
    score: 0.92,
    categories: ["Food Quality"],
    keywords: ["Heavenly", "Best"],
    orderItems: ["Chocolate Mousse", "Brownie"]
  }
];

export const calculateMetrics = (reviews) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return {
      total: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
      avgRating: "0.0",
      sentimentScore: 0,
      categoryPerformance: [],
      topPositiveKeywords: [],
      topNegativeKeywords: []
    };
  }
  const total = reviews.length;

  const positive = reviews.filter(r => r.sentiment === 'positive').length;
  const negative = reviews.filter(r => r.sentiment === 'negative').length;
  const neutral = reviews.filter(r => r.sentiment === 'neutral').length;

  const avgRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1);
  const sentimentScore = ((positive - negative) / total) * 100;

  // Category Analysis
  const categoryStats = {};
  reviews.forEach(r => {
    if (r.categories && Array.isArray(r.categories)) {
      r.categories.forEach(cat => {
        if (!categoryStats[cat]) {
          categoryStats[cat] = { name: cat, total: 0, positive: 0, negative: 0, sentimentSum: 0 };
        }
        categoryStats[cat].total++;
        categoryStats[cat].sentimentSum += r.score || 0;
        if (r.sentiment === 'positive') categoryStats[cat].positive++;
        if (r.sentiment === 'negative') categoryStats[cat].negative++;
      });
    }
  });



  const categoryPerformance = Object.values(categoryStats).map(cat => ({
    ...cat,
    score: cat.total > 0 ? Math.round((cat.sentimentSum / cat.total) * 100) : 0
  })).sort((a, b) => (b.score || 0) - (a.score || 0));


  // Keyword Analysis (Top 5 Positive & Negative)
  const wordMap = { positive: {}, negative: {} };
  reviews.forEach(r => {
    if (r.sentiment !== 'neutral' && r.keywords && Array.isArray(r.keywords)) {
      r.keywords.forEach(word => {
        if (!wordMap[r.sentiment][word]) wordMap[r.sentiment][word] = 0;
        wordMap[r.sentiment][word]++;
      });
    }
  });


  const getTopKeywords = (map) => Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return {
    total,
    positive,
    negative,
    neutral,
    avgRating,
    sentimentScore: Math.round(sentimentScore),
    categoryPerformance,
    topPositiveKeywords: getTopKeywords(wordMap.positive),
    topNegativeKeywords: getTopKeywords(wordMap.negative)
  };
};
