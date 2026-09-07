import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const api = axios.create({
  baseURL: "https://api.paystack.co",
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
});

export const initializePayment = async (email, amount, metadata) => {
  const { data } = await api.post("/transaction/initialize", {
    email,
    amount, // amount must already be in kobo when you call this
    callback_url: `${process.env.CLIENT_URL}/student/invoices`,
    metadata,
  });

  if (!data.status) throw new Error(data.message);
  return data.data;
};

export const verifyPayment = async (reference) => {
  const { data } = await api.get(`/transaction/verify/${reference}`);
  if (!data.status) throw new Error("Verification failed");
  return data.data;
};
