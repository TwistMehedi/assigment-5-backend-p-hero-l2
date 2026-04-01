import { prisma } from "../../lib/prisma";

export const getProviderDashboardService = async (providerId: string) => {
  const providerMovies = await prisma.media.findMany({
    where: { userId: providerId },
    select: { id: true, price: true, title: true },
  });

  const providerSeries = await prisma.series.findMany({
    where: { userId: providerId },
    select: { id: true, price: true, title: true },
  });

  const movieIds = providerMovies.map((m) => m.id);
  const seriesIds = providerSeries.map((s) => s.id);

  const allPurchases = await prisma.purchase.findMany({
    where: {
      itemId: { in: [...movieIds, ...seriesIds] },
      status: "COMPLETED",
    },
  });

  const totalMovieSales = allPurchases.filter(
    (p) => p.itemType === "MOVIE",
  ).length;
  const totalSeriesSales = allPurchases.filter(
    (p) => p.itemType === "SERIES",
  ).length;

  const totalRevenue = allPurchases.reduce((sum, p) => sum + p.amount, 0);

  const recentSales = await prisma.purchase.findMany({
    where: {
      itemId: { in: [...movieIds, ...seriesIds] },
      status: "COMPLETED",
    },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return {
    stats: {
      totalRevenue: totalRevenue.toFixed(2),
      totalSales: allPurchases.length,
      movieSalesCount: totalMovieSales,
      seriesSalesCount: totalSeriesSales,
      totalContent: providerMovies.length + providerSeries.length,
    },
    recentSales,
    contentSummary: {
      movies: providerMovies.length,
      series: providerSeries.length,
    },
  };
};

export const getUserDashboardService = async (userId: string) => {
  const userStats = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      purchases: {
        include: {
          media: true,
          series: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  const aggregatePurchases = await prisma.purchase.aggregate({
    where: { userId },
    _sum: {
      amount: true,
    },
    _count: {
      id: true,
    },
  });

  const formattedPurchases = userStats?.purchases.map((p: any) => ({
    id: p.id,
    amount: p.amount,
    createdAt: p.createdAt,
    itemType: p.movie ? "MOVIE" : "SERIES",
    title: p.movie?.title || p.series?.title,
    thumbnail: p.movie?.thumbnail || p.series?.thumbnail,
  }));

  return {
    name: userStats?.name,
    email: userStats?.email,
    stats: {
      totalPurchased: aggregatePurchases._count.id || 0,
      totalSpent: aggregatePurchases._sum.amount || 0,
      watchTime: 0,
    },
    purchases: formattedPurchases,
  };
};

export const getPurchasedAll = async (userId: string) => {
  const result = await prisma.purchase.findMany({
    where: { userId },
    include: {
      media: true,
      series: true,
    },
  });
  return result;
};
