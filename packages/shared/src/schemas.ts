import { z } from 'zod';

export const transactionTypeSchema = z.enum(['income', 'expense']);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof userSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: transactionTypeSchema,
  icon: z.string(),
  color: z.string(),
});
export type Category = z.infer<typeof categorySchema>;

export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number().int(),
  type: transactionTypeSchema,
  categoryId: z.string(),
  note: z.string().nullable(),
  occurredAt: z.string(),
  createdAt: z.string(),
});
export type Transaction = z.infer<typeof transactionSchema>;

export const createTransactionInputSchema = z.object({
  amount: z.number().int().positive(),
  type: transactionTypeSchema,
  categoryId: z.string(),
  note: z.string().max(280).optional(),
  occurredAt: z.string().datetime(),
});
export type CreateTransactionInput = z.infer<typeof createTransactionInputSchema>;
