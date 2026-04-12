import { prisma } from "../../lib/prisma";

export const getAdminDashboardService = async () => {
  const [
    totalUsers,
    totalProviders,
    totalMovies,
    totalSeries,
    allCompletedPurchases,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "USER" } }),
    prisma.user.count({ where: { role: "CREATOR" } }),
    prisma.media.count(),
    prisma.series.count(),
    prisma.purchase.findMany({
      where: { status: "COMPLETED" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  const totalRevenue = allCompletedPurchases.reduce(
    (sum, p) => sum + p.amount,
    0,
  );

  const movieRevenue = allCompletedPurchases
    .filter((p) => p.itemType === "MOVIE")
    .reduce((sum, p) => sum + p.amount, 0);

  const seriesRevenue = allCompletedPurchases
    .filter((p) => p.itemType === "SERIES")
    .reduce((sum, p) => sum + p.amount, 0);

  const recentTransactions = await prisma.purchase.findMany({
    where: { status: "COMPLETED" },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      media: { select: { title: true } },
      series: { select: { title: true } },
    },
  });

  return {
    overview: {
      totalRevenue: totalRevenue.toFixed(2),
      movieRevenue: movieRevenue.toFixed(2),
      seriesRevenue: seriesRevenue.toFixed(2),
      totalSales: allCompletedPurchases.length,
    },
    counts: {
      users: totalUsers,
      providers: totalProviders,
      movies: totalMovies,
      series: totalSeries,
      totalContent: totalMovies + totalSeries,
    },
    recentUsers,
    recentTransactions: recentTransactions.map((t) => ({
      id: t.id,
      customer: t.user?.name,
      item: t.media?.title || t.series?.title,
      amount: t.amount,
      date: t.createdAt,
    })),
  };
};

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
      series: {
        include: {
          seasons: {
            include: {
              episodes: {
                orderBy: {
                  episodeNumber: "asc",
                },
              },
            },
          },
        },
      },
    },
  });

  return result;
};

export const getAllTransactionsService = async (query: {
  page?: string;
  limit?: string;
  searchTerm?: string;
  status?: string;
}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.searchTerm) {
    where.OR = [
      { transactionId: { contains: query.searchTerm, mode: "insensitive" } },
      { user: { name: { contains: query.searchTerm, mode: "insensitive" } } },
      { user: { email: { contains: query.searchTerm, mode: "insensitive" } } },
    ];
  }

  const [transactions, totalCount] = await Promise.all([
    prisma.purchase.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        media: {
          select: { title: true },
        },
        series: {
          select: { title: true },
        },
      },
    }),
    prisma.purchase.count({ where }),
  ]);

  return {
    transactions,
    meta: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
    },
  };
};

export const getAllMoviesForAdminService = async () => {
  const movies = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { purchases: { where: { status: "COMPLETED" } } },
      },
      user: { select: { name: true } },
    },
  });

  const formattedMovies = await Promise.all(
    movies.map(async (movie) => {
      const revenue = await prisma.purchase.aggregate({
        where: { itemId: movie.id, status: "COMPLETED" },
        _sum: { amount: true },
      });

      return {
        ...movie,
        totalSales: movie._count.purchases,
        revenue: revenue._sum.amount || 0,
      };
    }),
  );

  return formattedMovies;
};

export const getAllSeriesForAdminService = async () => {
  const series = await prisma.series.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      seasons: {
        orderBy: { seasonNumber: "asc" },
        include: {
          episodes: {
            orderBy: { episodeNumber: "asc" },
          },
        },
      },
      _count: {
        select: { purchases: { where: { status: "COMPLETED" } } },
      },
    },
  });

  const formattedSeries = await Promise.all(
    series.map(async (s) => {
      const revenue = await prisma.purchase.aggregate({
        where: { itemId: s.id, status: "COMPLETED" },
        _sum: { amount: true },
      });

      const totalEpisodes = s.seasons.reduce(
        (sum, season) => sum + season.episodes.length,
        0,
      );

      return {
        id: s.id,
        title: s.title,
        posterUrl: s.posterUrl,
        isPremium: s.isPremium,
        genre: s.genre,
        provider: s.user?.name || "Admin",
        totalSeasons: s.seasons.length,
        totalEpisodes: totalEpisodes,
        totalSales: s._count.purchases,
        revenue: revenue._sum.amount || 0,
        seasons_data: s.seasons,
      };
    }),
  );

  return formattedSeries;
};

export const getAllUserService = async (searchTerm: string) => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
};

export const updateUserRoleService = async (id: string, role: string) => {
  return await prisma.user.update({
    where: { id },
    data: { role },
  });
};

export const deleteUserService = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.purchase.deleteMany({
      where: { userId: id },
    });

    await tx.payment.deleteMany({
      where: { userId: id },
    });

    const deletedUser = await tx.user.delete({
      where: { id },
    });

    return deletedUser;
  });
};

export const watchLetterService = async (
  userId: string,
  payload: {
    mediaId?: string;
    seriesId?: string;
  },
) => {
  console.log("watch letter clicked", "userId:", userId, "payload:", payload);
};
