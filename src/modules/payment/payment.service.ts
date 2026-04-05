import Stripe from "stripe";
import { env } from "../../config/envConfig";
import { Request } from "express";
import { prisma } from "../../lib/prisma";
import { PurchaseType } from "../../generated/prisma";
import { ErrorHandler } from "../../utils/errorHandler";

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

export const checkoutService = async ({
  itemId,
  itemType,
  price,
  title,
  userId,
}: {
  itemId: string;
  itemType: string;
  price: number;
  title: string;
  userId: string;
}) => {
  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      itemId,
      userId,
    },
  });

  if (existingPurchase) {
    throw new ErrorHandler("You have already unlocked this movie", 400);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
            description: `Access to ${itemType}: ${title}`,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",

    success_url: `${env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&itemId=${itemId}`,
    cancel_url: `${env.CLIENT_URL}/checkout/${itemId}`,

    metadata: {
      itemId,
      itemType,
      userId,
    },
  });

  return {
    url: session.url,
    sessionId: session.id,
  };
};

export const verifyPaymentService = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  console.log("session backend", session);

  if (session.payment_status === "paid") {
    const { userId, itemId, itemType } = session.metadata || {};

    if (!userId || !itemId || !itemType) {
      throw new ErrorHandler(
        "Missing required metadata in Stripe session",
        400,
      );
    }

    const existingPurchase = await prisma.purchase.findUnique({
      where: { transactionId: session.id },
    });

    if (existingPurchase) {
      return {
        success: true,
        message: "Already verified",
        data: { itemId, itemType: itemType.toLowerCase() },
      };
    }

    let mediaId = null;
    let seriesId = null;

    if (itemType.toUpperCase() === "MOVIE") {
      const movie = await prisma.media.findUnique({ where: { id: itemId } });
      if (movie) mediaId = movie.id;
    } else if (itemType.toUpperCase() === "SERIES") {
      const series = await prisma.series.findUnique({ where: { id: itemId } });
      if (series) seriesId = series.id;
    }

    const purchase = await prisma.purchase.create({
      data: {
        userId: userId as string,
        itemId: itemId as string,
        itemType: itemType.toUpperCase() as any,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        transactionId: session.id,
        status: "COMPLETED",
        mediaId: mediaId,
        seriesId: seriesId,
      },
    });

    return {
      success: true,
      data: {
        itemId: purchase.itemId,
        itemType: itemType.toLowerCase(),
      },
    };
  }

  return { success: false, message: "Payment not completed" };
};

export const purChaseMovieAndSeries = async (
  userId: string,
  itemId: string,
) => {
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      itemId,
      status: "COMPLETED",
    },
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
            orderBy: {
              seasonNumber: "asc",
            },
          },
        },
      },
    },
  });

  return purchase;
};

