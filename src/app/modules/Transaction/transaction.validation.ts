import { z } from "zod";


export const transactionZodSchema = z.object({

    password: z.string(),
    amount: z
        .number({
            required_error: "Amount is required",
            invalid_type_error: "Amount must be a number",
        })
        .min(20, { message: "Amount must be at least 20" }),



    toUserPhone: z.string().optional(),
    description: z.string().optional(),

});
